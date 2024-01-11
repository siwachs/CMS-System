<?php

namespace App\EventListener;

use Symfony\Component\Workflow\Event\TransitionEvent;
use Pimcore\Model\Notification\Service\NotificationService;
use Pimcore\Model\DataObject\Product;

class WorkflowListener
{
    private $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function onSubmitForReview(TransitionEvent $event): void
    {
        $object = $event->getSubject();
        if ($object instanceof Product) {
            // Handle Workflow transitions
        }
    }
}
