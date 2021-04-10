<?php

namespace App\Controller\Calendar;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class CalendarController extends AbstractController
{
    /**
     * @Route("/calendrier",name="calendar.index")
     * @return Response
     */
    public function index(Request $request): Response {


        return $this->render("calendar/index.html.twig");
    }
}