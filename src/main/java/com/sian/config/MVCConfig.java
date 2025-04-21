package com.sian.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.sian.config.interceptor.NoCacheInterceptor;
import javax.servlet.MultipartConfigElement;

@Configuration
public class MVCConfig implements WebMvcConfigurer {

	@Autowired
	private NoCacheInterceptor noCacheInterceptor;

	/*
	 * @Primary
	 * 
	 * @Bean(name = "dataSource") public DriverManagerDataSource dataSource() {
	 * DriverManagerDataSource driverManagerDataSource = new
	 * DriverManagerDataSource(); driverManagerDataSource.setDriverClassName(
	 * "net.sf.log4jdbc.sql.jdbcapi.DriverSpy"); driverManagerDataSource.setUrl(
	 * "jdbc:log4jdbc:mysql://svr.ohcomon.com:4406/news_2digit?characterEncoding=utf8&serverTimezone=UTC&useSSL=false"
	 * ); driverManagerDataSource.setUsername("2digit");
	 * driverManagerDataSource.setPassword("digit2");
	 * driverManagerDataSource.setUrl(
	 * "jdbc:log4jdbc:mysql://54.180.83.35:3306/news_2digit?characterEncoding=utf8&serverTimezone=UTC&useSSL=false"
	 * ); driverManagerDataSource.setUsername("nlisimplehan");
	 * driverManagerDataSource.setPassword("simplehan"); return
	 * driverManagerDataSource; }
	 */

	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOrigins("*")
						.allowedMethods(HttpMethod.HEAD.name(), HttpMethod.POST.name(), HttpMethod.GET.name(),
								HttpMethod.PUT.name(), HttpMethod.DELETE.name(), HttpMethod.PATCH.name())
						.allowCredentials(false).maxAge(3600);
			}
		};
	}

	/**
	 * Multipart File Upload
	 * 
	 * @return
	 */
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		return new MultipartConfigElement("");
	}

	@Bean
	public MultipartResolver multipartResolver() {
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
		multipartResolver.setMaxUploadSize(10000000);
		return multipartResolver;
	}

}
