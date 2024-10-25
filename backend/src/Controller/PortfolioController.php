<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PortfolioController extends AbstractController
{
    private $portfolioService;

    public function __construct(OrderService $portfolioService)
    {
        $this->portfolioService = $portfolioService;
    }


    #[Route(path: '/api/portfolio', methods: ['GET'])]
    public function getPortfolio(): JsonResponse
    {
        $user = $this->getUser();
        $portfolioData = $this->portfolioService->getPortfolioData($user);

        return new JsonResponse($portfolioData);
    }
}
