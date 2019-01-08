package io.renren.modules.sys.controller;

import java.util.*;

import io.renren.common.validator.ValidatorUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.renren.modules.sys.entity.ShopEntity;
import io.renren.modules.sys.service.ShopService;
import io.renren.common.utils.PageUtils;
import io.renren.common.utils.R;


/**
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-08 15:58:48
 */
@RestController
@RequestMapping("sys/shop" )
public class ShopController {
    @Autowired
    private ShopService shopService;

    /**
     * 列表
     */
    @RequestMapping("/list" )
    @RequiresPermissions("sys:shop:list" )
    public R list(String shopName, Integer shopType, Integer status, @RequestParam(name = "page", defaultValue = "10" ) Integer page,
                  @RequestParam(name = "limit", defaultValue = "10" ) Integer limit) {
        PageUtils pageResult = shopService.queryPage(shopName, shopType, status, page, limit);
        return R.ok().put("page", pageResult);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{id}" )
    @RequiresPermissions("sys:shop:info" )
    public R info(@PathVariable("id" ) Long id) {
        ShopEntity shop = shopService.selectById(id);

        return R.ok().put("shop", shop);
    }

    /**
     * 保存
     */
    @RequestMapping("/save" )
    @RequiresPermissions("sys:shop:save" )
    public R save(@RequestBody ShopEntity shop) {
        shopService.insert(shop);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update" )
    @RequiresPermissions("sys:shop:update" )
    public R update(@RequestBody ShopEntity shop) {
        ValidatorUtils.validateEntity(shop);
        shopService.updateAllColumnById(shop);//全部更新

        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete" )
    @RequiresPermissions("sys:shop:delete" )
    public R delete(@RequestBody Long[] ids) {
        shopService.deleteBatchIds(Arrays.asList(ids));

        return R.ok();
    }

}
