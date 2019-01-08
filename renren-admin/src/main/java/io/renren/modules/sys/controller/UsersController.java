package io.renren.modules.sys.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import io.renren.common.validator.ValidatorUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.renren.modules.sys.entity.UsersEntity;
import io.renren.modules.sys.service.UsersService;
import io.renren.common.utils.PageUtils;
import io.renren.common.utils.R;



/**
 * 前台用户表
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-04 10:49:34
 */
@RestController
@RequestMapping("sys/users")
public class UsersController {
    @Autowired
    private UsersService usersService;

    /**
     * 列表
     */
    @RequestMapping("/list")
    @RequiresPermissions("sys:users:list")
    public R list(@RequestParam Map<String, Object> params){
        PageUtils page = usersService.queryPage(params);
        return R.ok().put("page", page);
    }


    /**
     * 信息
     */
    @RequestMapping("/info/{userId}")
    @RequiresPermissions("sys:users:info")
    public R info(@PathVariable("userId") Long userId){
        UsersEntity users = usersService.selectById(userId);

        return R.ok().put("users", users);
    }

    /**
     * 保存
     */
    @RequestMapping("/save")
    @RequiresPermissions("sys:users:save")
    public R save(@RequestBody UsersEntity users){
        usersService.insert(users);

        return R.ok();
    }

    /**
     * 修改
     */
    @RequestMapping("/update")
    @RequiresPermissions("sys:users:update")
    public R update(@RequestBody UsersEntity users){
        ValidatorUtils.validateEntity(users);
        usersService.updateAllColumnById(users);//全部更新
        
        return R.ok();
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @RequiresPermissions("sys:users:delete")
    public R delete(@RequestBody Long[] userIds){
        usersService.deleteBatchIds(Arrays.asList(userIds));
        return R.ok();
    }

}
