package io.renren.modules.sys.service;

import com.baomidou.mybatisplus.service.IService;
import io.renren.common.utils.PageUtils;
import io.renren.modules.sys.entity.UsersEntity;

import java.util.Map;

/**
 * 前台用户表
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-04 10:49:34
 */
public interface UsersService extends IService<UsersEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

