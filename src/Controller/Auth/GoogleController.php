<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GoogleController extends AbstractController
{
    #[Route('/connect/google', name: 'connect_google')]
    public function connectAction(ClientRegistry $clientRegistry): Response
    {
       return $clientRegistry
            ->getClient('google')
            ->redirect([
                'email', 
                'profile',
            ], [
                'prompt' => 'login',
            ]);
    }

    #[Route('/connect/google/check', name: 'connect_google_check')]
    public function connectCheckAction(): Response
    {
        // This route will not be executed, as the authenticator handles it
        throw new \RuntimeException('Don\'t forget to activate the OAuth authenticator in security.yaml');
    }
}
