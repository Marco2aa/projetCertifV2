<?php

namespace App\Controller;

use ApiPlatform\OpenApi\Model\Response;
use App\Repository\CryptoRepository;
use App\Repository\UserRepository;
use App\Service\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route as AnnotationRoute;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class OrderController extends AbstractController
{

    private $orderService;
    private $userRepo;
    private $cryptoRepo;

    public function __construct(OrderService $orderService, UserRepository $userRepo, CryptoRepository $cryptoRepo)
    {
        $this->orderService = $orderService;
        $this->userRepo = $userRepo;
        $this->cryptoRepo = $cryptoRepo;
    }

    #[Route('/api/getorders', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getAllOrders(): JsonResponse
    {
        $user = $this->getUser();

        $orders = $this->orderService->getOrderDetails($user);

        return new JsonResponse($orders);
    }

    #[Route('/api/sellorder', methods: ['POST'])]
    public function createSaleOrder(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $type = $data['type'] ?? 'Vente';
        $quantity = $data['quantity'] ?? 0;
        $walletId = $data['walletId'] ?? null;
        $userId = $data['userId'] ?? null;
        $deviseId = 48;
        $deviseValue = 1;
        $cryptoValue = $data['cryptoValue'] ?? null;
        $cryptoLabel = $data['cryptoId'] ?? null;
        $user = $this->userRepo->findOneBy(['email' => $userId]);
        $createdAt = new \DateTimeImmutable();
        $crypto = $this->cryptoRepo->findOneBy(['name' => $cryptoLabel]);
        $cryptoId = $crypto->getId();

        try {
            $order = $this->orderService->createSaleOrder(
                $type,
                $quantity,
                $createdAt,
                $walletId,
                $user,
                $deviseId,
                $deviseValue,
                $cryptoValue,
                $cryptoId
            );

            return new JsonResponse(['status' => 'Order created', 'order' => $order], 201);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 400);
        }
    }
}
