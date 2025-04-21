package com.sian.config;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;

public class LogbackConfig extends Filter<ILoggingEvent> {
	/**
	 * Logback Filter 설정
	 */
	@Override
	public FilterReply decide(ILoggingEvent event) {

		if (event.getMessage().contains("SESSION") || event.getMessage().contains("local.server.port")) {
			return FilterReply.DENY;
		} else {
			return FilterReply.ACCEPT;
		}
	}
}
