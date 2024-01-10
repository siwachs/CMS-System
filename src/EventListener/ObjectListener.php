<?php

namespace App\EventListener;

use Pimcore\Event\Model\ElementEventInterface;
use Pimcore\Model\Element\ValidationException;
use Pimcore\Event\Model\DataObjectEvent;
use Pimcore\Model\DataObject\Product;

class ObjectListener
{
    public function onPreAdd(ElementEventInterface $event): void
    {
        if ($event instanceof DataObjectEvent) {
            $object = $event->getObject();
            if ($object instanceof Product) {
                //Handle Product Pre add
            }
        }
    }

    public function onPostAdd(ElementEventInterface $event): void
    {
        if ($event instanceof DataObjectEvent) {
            $object = $event->getObject();
            if ($object instanceof Product) {
                //Handle Product Post add
            }
        }
    }

    public function onPreUpdate(ElementEventInterface $event): void
    {
        if ($event instanceof DataObjectEvent) {
            $object = $event->getObject();
            if ($object instanceof Product) {
                //Handle Product Pre update
            }
        }
    }
}
