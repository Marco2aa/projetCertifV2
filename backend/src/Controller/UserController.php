<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\User;
use App\Entity\Wallet;
use App\Service\WalletService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{

    private $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }


    #[Route('/api/me')]
    #[IsGranted('ROLE_USER')]
    public function me()
    {
        return $this->json($this->getUser());
    }

    #[Route(path: '/api/register', name: 'app_register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload()]
        User $user,
        UserPasswordHasherInterface $hasheur,
        EntityManagerInterface $em
    ) {


        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());
        $hashedPassword = $hasheur->hashPassword($user, $user->getPassword());
        $user->setPassword($hashedPassword);


        $this->walletService->createWallet($user);


        $em->persist($user);

        $em->flush();

        return $this->json($user, 201, [], [
            'groups' => ['user.show']
        ]);
    }


    #[Route(path: '/api/user/upload-image', name: 'user_upload_image', methods: ['POST'])]
    public function uploadImage(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        /** @var User $user */
        $user = $this->getUser();

        // Récupérer l'image uploadée
        $file = $request->files->get('image');

        if ($file) {
            $uploadsDirectory = $this->getParameter('uploads_directory');
            $filename = md5(uniqid()) . '.' . $file->guessExtension();

            try {
                // Déplacer l'image téléchargée dans le répertoire défini
                $file->move($uploadsDirectory, $filename);

                // Définir le nom de l'image dans l'entité User
                $user->setImage($filename);

                // Enregistrer l'utilisateur
                $em->persist($user);
                $em->flush();

                return new JsonResponse(['image' => $filename], Response::HTTP_OK);
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'File upload failed.'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        return new JsonResponse(['error' => 'No file uploaded.'], Response::HTTP_BAD_REQUEST);
    }
}
