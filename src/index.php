<?php
namespace Payload;

class Payload
{
  public function init(array $options): Payload
  {
    $payload = initHTTP($options);
    foreach ($payload as $key => $value) {
      $this->$key = $value;
    }
    if (!isset($options['local'])) {
      if (is_callable($options['onInit'])) {
        $options['onInit']($this);
      }
      if (is_callable($this->config['onInit'])) {
        $this->config['onInit']($this);
      }
    }
    return $payload;
  }
}
$payload = new Payload();