<?php

namespace App\Controller;

use App\Entity\Tag;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/",name="homepage")
     * @return Response
     */
    public function index(): Response {
        return $this->render('homepage.html.twig');
    }

    /**
     * @Route("/test",name="test.index")
     * @return Response
     */
    public function test(Request $request): Response{

        $tag = $this->getDoctrine()->getRepository(Tag::class)->findOneBy(["id" => 25]);

        dump($tag);
       
        return $this->render('test/index.html.twig', [
            
        ]);
    }
}