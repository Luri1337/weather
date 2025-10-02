package config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import util.filter.SessionFilter;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<SessionFilter> filterRegistrationBean(SessionFilter sessionFilter) {
        FilterRegistrationBean<SessionFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(sessionFilter);
        filterRegistrationBean.addUrlPatterns("/");
        return filterRegistrationBean;
    }

}
