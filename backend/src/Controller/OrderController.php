<?php

namespace App\Controller;

use ApiPlatform\OpenApi\Model\Response;
use App\Service\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route as AnnotationRoute;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class OrderController extends AbstractController
{

    private $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    #[Route('/api/getorders', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getAllOrders(): JsonResponse
    {

        $orders = $this->orderService->getOrderDetails();

        return new JsonResponse($orders);
    }
}
