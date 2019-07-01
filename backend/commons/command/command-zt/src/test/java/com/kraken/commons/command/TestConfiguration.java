package com.kraken.commons.command;

import com.kraken.commons.rest.configuration.ApplicationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;

@Configuration
@ComponentScan
public class TestConfiguration {

  @Bean
  ApplicationProperties locations() {
    return ApplicationProperties.builder()
        .data(Path.of("data"))
        .hostData("/home/ubuntu")
        .hostUId("1001")
        .hostGId("1001")
        .build();
  }

}