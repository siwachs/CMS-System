<?php

namespace BackendExtBundle\EventListener;

use Pimcore\Event\BundleManager\PathsEvent;

class PimcoreAdminListener
{
    public function addJSFiles(PathsEvent $event): void
    {
        $event->setPaths(
            array_merge(
                $event->getPaths(),
                [
                    '/bundles/backendext/js/pimcore/startup.js'
                ]
            )
        );
    }
}
