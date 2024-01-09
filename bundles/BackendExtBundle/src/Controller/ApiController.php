<?php

namespace BackendExtBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use Pimcore\Db;
use Pimcore\Model\DataObject\Product;
use Pimcore\Model\DataObject\Brand;
use Pimcore\Model\DataObject\Category;

class ApiController extends AbstractController
{
    private $params;
    private $connection;

    public function __construct(ParameterBagInterface $params)
    {
        $this->params = $params;
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
            $entries->setUnpublished(true);
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
            $entries->setUnpublished(true);
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
     * @Route("/get-products", name="getProducts",methods={"GET"})
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function getProducts(Request $request): JsonResponse
    {
        try {
            $entries = new Product\Listing();
            $entries->setUnpublished(true);
            $products = [];

            foreach ($entries as $product) {
                $products[] = [
                    'id' => $product->getId(),
                    'productObjName' => $product->getKey(),
                    'createdAt' => $product->getCreationDate()
                ];
            }

            return new JsonResponse([
                'products' => $products,
                'success' => true,
                'error' => null
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse([
                'products' => [],
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
}
