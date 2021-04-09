<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;

class ApiAuthenticator extends AbstractGuardAuthenticator
{
    private  $entityManager;
    private  $urlGenerator;


    public function __construct(
        EntityManagerInterface $entityManager, 
        UrlGeneratorInterface $urlGenerator)
    {
        $this->entityManager = $entityManager;
        $this->urlGenerator = $urlGenerator;
    }

    public function supports(Request $request)
    {
        return $request->isXmlHttpRequest() && $request->headers->has('X-Auth-Token');
    }

    public function getCredentials(Request $request)
    {
        return $request->headers->get('X-Auth-Token');
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if($credentials === null){
            return new JsonResponse(array(
                "status" => "error",
                "message" => "Accès non autorisé."
            ));
        }

        return $this->entityManager->getRepository(User::class)->findOneBy(['apiToken' => $credentials]);
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        return true;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        return new JsonResponse(array(
            'status' => 'error',
            'message' => $this->translator->trans($exception->getMessageKey(), $exception->getMessageData()),
        ), Response::HTTP_UNAUTHORIZED);
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey)
    {
        return null;
    }

    public function start(Request $request, AuthenticationException $authException = null)
    {
        return new JsonResponse(array(
            'status' => 'error',
            'message' => "Authentification requise.",
        ), Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
