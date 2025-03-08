<?php

namespace App\Services;

use Stichoza\GoogleTranslate\GoogleTranslate;

class RecursiveTranslation
{
    protected $translator;

    public function __construct()
    {
        $this->translator = new GoogleTranslate();
    }

    /**
     * Recursively translate the input text into the target language.
     *
     * @param mixed $input
     * @param string $targetLanguage
     * @return mixed
     */
    public function translate($input, $targetLanguage)
    {
        // If the input is a string, translate it
        if (is_string($input)) {
            return $this->translateText($input, $targetLanguage);
        }

        // If the input is an array, loop through its elements and translate
        if (is_array($input)) {
            foreach ($input as $key => $item) {
                $input[$key] = $this->translate($item, $targetLanguage);
            }
            return $input;
        }

        // If the input is an object, loop through its properties and translate
        if (is_object($input)) {
            foreach (get_object_vars($input) as $property => $value) {
                $input->$property = $this->translate($value, $targetLanguage);
            }
            return $input;
        }

        // If it's neither a string, array, nor object, return the input
        return $input;
    }

    /**
     * Translate a single string of text.
     *
     * @param string $text
     * @param string $targetLanguage
     * @return string
     */
    private function translateText($text, $targetLanguage)
    {
        try {
            // Set the target language for translation
            $this->translator->setTarget($targetLanguage);
            // Translate the text
            return $this->translator->translate($text);
        } catch (\Exception $e) {
            // Handle errors gracefully
            return "Translation failed: " . $e->getMessage();
        }
    }
}
