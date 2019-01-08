package io.renren.modules.sys.service.impl;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import java.util.*;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.renren.common.utils.PageUtils;

import io.renren.modules.sys.dao.ShopDao;
import io.renren.modules.sys.entity.ShopEntity;
import io.renren.modules.sys.service.ShopService;


@Service("shopService" )
public class ShopServiceImpl extends ServiceImpl<ShopDao, ShopEntity> implements ShopService {

    @Override
    public PageUtils queryPage(String shopName, Integer shopType, Integer status, Integer page, Integer limit) {
        Page<ShopEntity> pageResult = this.selectPage(
                new Page<>(page, limit),
                new EntityWrapper<ShopEntity>()
                        .eq(StringUtils.isNotBlank(shopName), "shop_name", shopName)
                        .eq(null != shopType, "shop_type", shopType)
                        .eq(null != status, "status", status)
        );
        return new PageUtils(pageResult);
    }

}
