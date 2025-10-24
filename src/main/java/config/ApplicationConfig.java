package config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ComponentScan({"service", "dao", "util.interceptor", "external"})
@PropertySource("classpath:application.properties")
public class ApplicationConfig {}
