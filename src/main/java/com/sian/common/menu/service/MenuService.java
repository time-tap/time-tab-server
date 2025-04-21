package com.sian.common.menu.service;

import org.springframework.stereotype.Service;
import com.sian.common.menu.mapper.MenuMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuService {

	private final MenuMapper menuMapper;

}
