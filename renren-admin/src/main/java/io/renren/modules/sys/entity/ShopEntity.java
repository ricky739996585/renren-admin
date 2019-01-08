package io.renren.modules.sys.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;
import lombok.Data;

	import java.io.Serializable;
import java.util.*;

/**
 * 
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-08 14:45:44
 */
@Data
@TableName("shop")
public class ShopEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * 商品ID
	 */
	@TableId
	private Long id;
	/**
	 * 商品名称
	 */
	private String shopName;
	/**
	 * 商品类型
	 */
	private Integer shopType;
	/**
	 * 商品状态 0：上架，1：下架
	 */
	private Integer status;
	/**
	 * 创建时间
	 */
	private Date createTime;

}
