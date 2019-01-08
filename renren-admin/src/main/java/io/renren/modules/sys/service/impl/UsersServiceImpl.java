package io.renren.modules.sys.service.impl;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.Set;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import io.renren.common.utils.PageUtils;
import io.renren.common.utils.Query;

import io.renren.modules.sys.dao.UsersDao;
import io.renren.modules.sys.entity.UsersEntity;
import io.renren.modules.sys.service.UsersService;


@Service("usersService")
public class UsersServiceImpl extends ServiceImpl<UsersDao, UsersEntity> implements UsersService {

    @Override
    public PageUtils queryPage(Map<String, Object> params) {
        EntityWrapper<UsersEntity> entityWrapper = new EntityWrapper<>();
        Set<Map.Entry<String, Object>> entrySet = params.entrySet();
        for(Map.Entry<String, Object> entry:entrySet){
            if(!entry.getKey().equals("page") && !entry.getKey().equals("limit")){
                entityWrapper.eq(StringUtils.isNotBlank(entry.getValue().toString()),entry.getKey(),entry.getValue());
            }
        }

        Page<UsersEntity> page = this.selectPage(
                new Query<UsersEntity>(params).getPage(),entityWrapper
        );

        return new PageUtils(page);
    }

}
