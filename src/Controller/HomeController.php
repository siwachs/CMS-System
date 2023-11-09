<?php

namespace App\Controller;

use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends FrontendController
{
    /**
     * @param Request $request
     * @return array
     */
    public function indexAction(Request $request)
    {
        return [];
    }
}
