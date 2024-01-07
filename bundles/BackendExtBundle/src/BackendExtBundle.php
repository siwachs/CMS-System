<?php

namespace BackendExtBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\PimcoreBundleAdminClassicInterface;
use Pimcore\Extension\Bundle\Traits\BundleAdminClassicTrait;

class BackendExtBundle extends AbstractPimcoreBundle implements PimcoreBundleAdminClassicInterface
{
    use BundleAdminClassicTrait;

    public function getPath(): string
    {
        return \dirname(__DIR__);
    }

    public function getCssPaths(): array
    {
        return [
            '/bundles/backendext/css/pimcore/style.css'
        ];
    }

    public function getJsPaths(): array
    {
        return [
            '/bundles/backendext/js/pimcore/startup.js'
        ];
    }
}
