<?php

namespace App\Controller\Normalizer;

class TagNormalizer
{
    public function normalizeTag($tag){
        return array(
            'id' => $tag->getId(),
            'name' => $tag->getName(),
            'color' => $tag->getColor()
        );
    }
}