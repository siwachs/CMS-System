<?php

namespace BackendExtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use Pimcore\Db;
use Pimcore\Model\DataObject\Folder;
use Pimcore\Model\DataObject\Product;
use Pimcore\Model\DataObject\Brand;
use Pimcore\Model\DataObject\Category;
use Pimcore\Model\Notification\Service\NotificationService;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class ApiController extends AbstractController
{
    private $params;
    private $notificationService;
    private $connection;

    public function __construct(ParameterBagInterface $params, NotificationService $notificationService)
    {
        $this->params = $params;
        $this->notificationService = $notificationService;
        $this->connection = Db::get();
    }

    /**
     * @Route("/get-brands", name="getBrands",methods={"GET"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getBrands(Request $request): JsonResponse
    {
        try {
            $entries = new Brand\Listing();
            $brands = [];

            foreach ($entries as $brand) {
                $brands[] = [
                    'id' => $brand->getId(),
                    'brandObjName' => $brand->getKey(),
                    'createdAt' => $brand->getCreationDate()
                ];
            }

            return new JsonResponse([
                'brands' => $brands,
                'success' => true,
                'error' => null
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse([
                'brands' => [],
                'success' => false,
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/get-categories", name="getCategories",methods={"GET"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getCategories(Request $request): JsonResponse
    {
        try {
            $entries = new Category\Listing();
            $categories = [];

            foreach ($entries as $category) {
                $categories[] = [
                    'id' => $category->getId(),
                    'categoryObjName' => $category->getKey(),
                    'createdAt' => $category->getCreationDate()
                ];
            }

            return new JsonResponse([
                'categories' => $categories,
                'success' => true,
                'error' => null
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse([
                'categories' => [],
                'success' => false,
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/get-users", name="getUsers", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $sql =  $this->params->get('users_query');

            $stmt = $this->connection->executeQuery($sql);
            $users = $stmt->fetchAllAssociative();

            return new JsonResponse([
                'users' => $users,
                'success' => true,
                'error' => null
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse([
                'users' => [],
                'success' => false,
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a product by its name from the Pimcore product listing.
     *
     * @param string $productName The name of the product to retrieve.
     * @return Product|null The found product or null if not found.
     */
    private function getProduct(string $productName)
    {
        $products = new Product\Listing();
        $products->setUnpublished(true);
        $products->setLimit(1);
        $products->filterByKey($productName);

        foreach ($products as $product) {
            return $product;
        }

        return null;
    }

    /**
     * Creates a new product in Pimcore.
     *
     * @param string $productName The name of the product.
     * @param string $productPath The path for the product.
     * @return void
     */
    private function createProduct(string $productName, string $productPath)
    {
        $product = new Product();
        $product->setKey(\Pimcore\Model\Element\Service::getValidKey($productName, 'object'));

        // Get or create the folder for the product
        $folder = Folder::getByPath($productPath);
        if (!$folder instanceof Folder) {
            $folder = new Folder();
            $folder->setKey(basename($productPath));
            $folder->setParentId(1); // Set the parent folder ID (change if needed)
            $folder->save();
        }

        // Set the parent folder for the product and save it
        $product->setParentId($folder->getId());
        $product->save();
        return $product;
    }

    /**
     * @Route("/assign-product", name="assignProduct",methods={"POST"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function assignProduct(Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent(), true);

            // Extract parameters from the request body
            $brandId = intval($content['brand-id'] ?? 0);
            $categoryId = intval($content['category-id'] ?? 0);
            $productOwner = intval($content['product-owner'] ?? 0);
            $userId = intval($content['user-id'] ?? 0);
            $objectName = trim($content['object-name'] ?? '');
            $message = trim($content['message'] ?? '');
            $productPath = $this->params->get('products_storage_path');
            $notificationSender = $this->params->get('pimcore_notification_sender');
            $pimcoreNotificationTitle = $this->params->get('pimcore_notification_title');

            // Validate the parameters
            if (
                !is_int($brandId) || $brandId <= 0 ||
                !is_int($categoryId) || $categoryId <= 0 ||
                !is_int($productOwner) || $productOwner <= 0 ||
                !is_int($userId) || $userId <= 0
            ) {
                throw new BadRequestHttpException('Brand ID, Category ID, User ID and Product Owner must be
                 non-zero positive integers.');
            }

            if ($objectName === '' || $message === '') {
                throw new BadRequestHttpException('Object Name and Message cannot be empty strings.');
            }

            $brand = Brand::getById($brandId);
            $category = Category::getById($categoryId);

            if (!$brand || !$category) {
                throw new BadRequestHttpException('Master data brand or category is invalid');
            }

            $product = $this->getProduct($objectName) ?? $this->createProduct($objectName, $productPath);

            $product->setBrand([$brand]);
            $product->setCategory([$category]);
            $product->setUserOwner($productOwner);
            $product->setProductUser($userId);
            $product->save();
            $this->notificationService->sendToUser(
                $userId,
                $notificationSender,
                $pimcoreNotificationTitle,
                $message,
                $product
            );

            return new JsonResponse([
                'message' => 'Product created.',
                'success' => true,
                'error' => null
            ], Response::HTTP_OK);
        } catch (BadRequestException $e) {
            return new JsonResponse([
                'message' => 'Product creation failed.',
                'success' => false,
                'error' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Product creation failed.',
                'success' => false,
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
