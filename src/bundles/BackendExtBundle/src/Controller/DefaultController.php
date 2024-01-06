<?php

namespace BackendExtBundle\Controller;

use Pimcore\Controller\FrontendController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends FrontendController
{
    /**
     * @Route("/backend_ext")
     */
    public function indexAction(Request $request): Response
    {
        return new Response('Hello world from backend_ext');
    }
}
