<?php

namespace App\Model\DataObject;

use Pimcore\Model\DataObject\Product as BaseProduct;

class Product extends BaseProduct
{
    public function isProductOwner()
    {
        $currentUser = \Pimcore\Tool\Admin::getCurrentUser();
        return $currentUser->getId() === $this->getUserOwner();
    }
}
