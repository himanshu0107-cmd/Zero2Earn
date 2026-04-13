package com.zero2earn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication(exclude = {HibernateJpaAutoConfiguration.class})
public class Zero2EarnApplication {
    public static void main(String[] args) {
        SpringApplication.run(Zero2EarnApplication.class, args);
    }
}
