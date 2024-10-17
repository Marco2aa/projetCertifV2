<?php

namespace App\Controller;

use ApiPlatform\Symfony\Validator\Validator;
use ApiPlatform\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Entity\User;
use App\Entity\Wallet;
use App\Repository\UserRepository;
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
        return $this->json($this->getUser(), 201, [], [
            'groups' => ['user.show']
        ]);
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
    #[IsGranted('ROLE_USER')]  // S'assure que l'utilisateur est connecté
    public function uploadImage(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        /** @var User $user */
        $user = $this->getUser();

        // Récupérer l'image uploadée
        $file = $request->files->get('image');

        if ($file) {
            // Chemin de stockage des images dans public/images/users
            $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/images/users';
            $filename = md5(uniqid()) . '.' . $file->guessExtension();

            try {
                // Déplacer l'image téléchargée dans le répertoire défini
                $file->move($uploadsDirectory, $filename);

                // Définir le nom de l'image dans l'entité User
                $user->setImage('/images/users/' . $filename);

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

    #[Route('/api/user/update', name: 'update_user', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]  // S'assure que l'utilisateur est connecté
    public function updateUser(
        Request $request,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository
    ): JsonResponse {
        $user = $this->getUser(); // Récupère l'utilisateur connecté

        if (!$user instanceof User) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupérer les données de la requête JSON si présentes
        $data = $request->request->all();

        // Récupérer le fichier image si présent
        $file = $request->files->get('profilePicture');
        if ($file) {
            // Chemin de stockage des images dans public/images/users
            $uploadsDirectory = $this->getParameter('kernel.project_dir') . '/public/images/users';
            $fileName = uniqid() . '.' . $file->guessExtension();

            try {
                $file->move($uploadsDirectory, $fileName);
                $user->setImage('/images/users/' . $fileName); // Enregistre le chemin de l'image
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Failed to upload image'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        // Mettez à jour les autres informations de l'utilisateur à l'exception du mot de passe
        if (isset($data['firstName'])) {
            $user->setPrenom($data['firstName']);
        }

        if (isset($data['lastName'])) {
            $user->setNom($data['lastName']);
        }

        if (isset($data['email'])) {
            $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
            if ($existingUser && $existingUser !== $user) {
                return new JsonResponse(['error' => 'Email already in use'], JsonResponse::HTTP_CONFLICT);
            }
            $user->setEmail($data['email']);
        }

        if (isset($data['role'])) {
            $user->setRoles([$data['role']]);
        }

        if (isset($data['countryCode'])) {
            $user->setCountryCode($data['countryCode']);
        }

        if (isset($data['phoneNumber'])) {
            $user->setPhoneNumber($data['phoneNumber']);
        }

        if (isset($data['bio'])) {
            $user->setBio($data['bio']);
        }

        // Sauvegarde des modifications
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'User updated successfully',
            'user' => [
                'firstName' => $user->getPrenom(),
                'lastName' => $user->getNom(),
                'email' => $user->getEmail(),
                'role' => $user->getRoles(),
                'countryCode' => $user->getCountryCode(),
                'phoneNumber' => $user->getPhoneNumber(),
                'bio' => $user->getBio(),
                'profilePicture' => $user->getImage(), // Ajout de l'URL de l'image
            ]
        ], JsonResponse::HTTP_OK);
    }
}
