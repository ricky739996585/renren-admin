package io.renren.modules.sys.service;

import com.baomidou.mybatisplus.service.IService;
import io.renren.common.utils.PageUtils;
import io.renren.modules.sys.entity.ShopEntity;

import java.util.*;

/**
 * 
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-08 15:58:48
 */
public interface ShopService extends IService<ShopEntity> {

    PageUtils queryPage(String shopName, Integer shopType, Integer status, Integer page, Integer limit);
}

