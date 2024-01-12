<?php

namespace App\EventListener;

use Symfony\Component\Workflow\Event\TransitionEvent;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use Pimcore\Model\Notification\Service\NotificationService;
use Pimcore\Model\Element\ValidationException;
use Pimcore\Model\DataObject\Product;

class WorkflowListener
{
    private $params;
    private $notificationService;

    public function __construct(ParameterBagInterface $params, NotificationService $notificationService)
    {
        $this->params = $params;
        $this->notificationService = $notificationService;
    }

    private function validateProduct(Product $product)
    {
        $productUser = $product->getProductUser();
        if ($productUser === null || $productUser === "" || $productUser === 0) {
            throw new ValidationException("A product user must defined.");
        }
    }

    public function onSubmitForReview(TransitionEvent $event): void
    {
        $object = $event->getSubject();
        if ($object instanceof Product) {
            $this->validateProduct($object);
            $context = $event->getContext("notes");
            $message = $context["notes"];
            $this->notificationService->sendToUser(
                $object->getUserOwner(), // Receiver
                $object->getProductUser(), // Sender
                $this->params->get("workflow_inreview_transition_message_title"),
                $message,
                $object
            );
        }
    }

    public function onRejectProduct(TransitionEvent $event): void
    {
        $object = $event->getSubject();
        if ($object instanceof Product) {
            $this->validateProduct($object);
            $context = $event->getContext("notes");
            $message = $context["notes"];
            $this->notificationService->sendToUser(
                $object->getProductUser(), // Receiver
                $object->getUserOwner(), // Sender
                $this->params->get("workflow_reject_product_transition_message_title"),
                $message,
                $object
            );
        }
    }

    public function onRestartProductWorkflow(TransitionEvent $event): void
    {
        $object = $event->getSubject();
        if ($object instanceof Product) {
            $this->validateProduct($object);
            $context = $event->getContext("notes");
            $message = $context["notes"];
            $this->notificationService->sendToUser(
                $object->getProductUser(), // Receiver
                $object->getUserOwner(), // Sender
                $this->params->get("workflow_restart_product_transition_message_title"),
                $message,
                $object
            );
        }
    }
}
