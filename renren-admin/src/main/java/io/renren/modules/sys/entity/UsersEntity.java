package io.renren.modules.sys.entity;

import com.baomidou.mybatisplus.annotations.TableId;
import com.baomidou.mybatisplus.annotations.TableName;

import java.io.Serializable;
import java.util.Date;

/**
 * 前台用户表
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2019-01-04 10:49:34
 */
@TableName("users")
public class UsersEntity implements Serializable {
	private static final long serialVersionUID = 1L;

	/**
	 * ID
	 */
	@TableId
	private Long userId;
	/**
	 * 用于删除 0：未删除 1：删除
	 */
	private Integer dr;
	/**
	 * 平台ID
	 */
	private String schoolId;
	/**
	 * 手机号码(登录账号)
	 */
	private String mobile;
	/**
	 * 用户昵称
	 */
	private String nickName;
	/**
	 * 头像地址
	 */
	private String pic;
	/**
	 * 状态  0：禁用   1：正常
	 */
	private Integer status;
	/**
	 * 性别0女，1男，2保密
	 */
	private Integer sex;
	/**
	 * 邮箱
	 */
	private String email;
	/**
	 * 登录密码
	 */
	private String password;
	/**
	 * 创建用户
	 */
	private Long creator;
	/**
	 * 创建时间
	 */
	private Date creationTime;
	/**
	 * 修改用户
	 */
	private Long modifier;
	/**
	 * 修改时间
	 */
	private Date modifiedTime;
	/**
	 * 最近登录时间
	 */
	private Date lastLoginTime;
	/**
	 * 最近登录IP
	 */
	private String lastLoginIp;
	/**
	 * 来源 0.正常注册;1.后台注册;2.NC导入
	 */
	private Integer channel;
	/**
	 * 备注
	 */
	private String remake;
	/**
	 * NC_ID
	 */
	private String ncId;
	/**
	 * 部门PK
	 */
	private Long deptId;
	/**
	 * 
	 */
	private String realName;
	/**
	 * 从NC中取得的商机pk

	 */
	private String ncUserId;

	/**
	 * 设置：ID
	 */
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	/**
	 * 获取：ID
	 */
	public Long getUserId() {
		return userId;
	}
	/**
	 * 设置：用于删除 0：未删除 1：删除
	 */
	public void setDr(Integer dr) {
		this.dr = dr;
	}
	/**
	 * 获取：用于删除 0：未删除 1：删除
	 */
	public Integer getDr() {
		return dr;
	}
	/**
	 * 设置：平台ID
	 */
	public void setSchoolId(String schoolId) {
		this.schoolId = schoolId;
	}
	/**
	 * 获取：平台ID
	 */
	public String getSchoolId() {
		return schoolId;
	}
	/**
	 * 设置：手机号码(登录账号)
	 */
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	/**
	 * 获取：手机号码(登录账号)
	 */
	public String getMobile() {
		return mobile;
	}
	/**
	 * 设置：用户昵称
	 */
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	/**
	 * 获取：用户昵称
	 */
	public String getNickName() {
		return nickName;
	}
	/**
	 * 设置：头像地址
	 */
	public void setPic(String pic) {
		this.pic = pic;
	}
	/**
	 * 获取：头像地址
	 */
	public String getPic() {
		return pic;
	}
	/**
	 * 设置：状态  0：禁用   1：正常
	 */
	public void setStatus(Integer status) {
		this.status = status;
	}
	/**
	 * 获取：状态  0：禁用   1：正常
	 */
	public Integer getStatus() {
		return status;
	}
	/**
	 * 设置：性别0女，1男，2保密
	 */
	public void setSex(Integer sex) {
		this.sex = sex;
	}
	/**
	 * 获取：性别0女，1男，2保密
	 */
	public Integer getSex() {
		return sex;
	}
	/**
	 * 设置：邮箱
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	/**
	 * 获取：邮箱
	 */
	public String getEmail() {
		return email;
	}
	/**
	 * 设置：登录密码
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	/**
	 * 获取：登录密码
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * 设置：创建用户
	 */
	public void setCreator(Long creator) {
		this.creator = creator;
	}
	/**
	 * 获取：创建用户
	 */
	public Long getCreator() {
		return creator;
	}
	/**
	 * 设置：创建时间
	 */
	public void setCreationTime(Date creationTime) {
		this.creationTime = creationTime;
	}
	/**
	 * 获取：创建时间
	 */
	public Date getCreationTime() {
		return creationTime;
	}
	/**
	 * 设置：修改用户
	 */
	public void setModifier(Long modifier) {
		this.modifier = modifier;
	}
	/**
	 * 获取：修改用户
	 */
	public Long getModifier() {
		return modifier;
	}
	/**
	 * 设置：修改时间
	 */
	public void setModifiedTime(Date modifiedTime) {
		this.modifiedTime = modifiedTime;
	}
	/**
	 * 获取：修改时间
	 */
	public Date getModifiedTime() {
		return modifiedTime;
	}
	/**
	 * 设置：最近登录时间
	 */
	public void setLastLoginTime(Date lastLoginTime) {
		this.lastLoginTime = lastLoginTime;
	}
	/**
	 * 获取：最近登录时间
	 */
	public Date getLastLoginTime() {
		return lastLoginTime;
	}
	/**
	 * 设置：最近登录IP
	 */
	public void setLastLoginIp(String lastLoginIp) {
		this.lastLoginIp = lastLoginIp;
	}
	/**
	 * 获取：最近登录IP
	 */
	public String getLastLoginIp() {
		return lastLoginIp;
	}
	/**
	 * 设置：来源 0.正常注册;1.后台注册;2.NC导入
	 */
	public void setChannel(Integer channel) {
		this.channel = channel;
	}
	/**
	 * 获取：来源 0.正常注册;1.后台注册;2.NC导入
	 */
	public Integer getChannel() {
		return channel;
	}
	/**
	 * 设置：备注
	 */
	public void setRemake(String remake) {
		this.remake = remake;
	}
	/**
	 * 获取：备注
	 */
	public String getRemake() {
		return remake;
	}
	/**
	 * 设置：NC_ID
	 */
	public void setNcId(String ncId) {
		this.ncId = ncId;
	}
	/**
	 * 获取：NC_ID
	 */
	public String getNcId() {
		return ncId;
	}
	/**
	 * 设置：部门PK
	 */
	public void setDeptId(Long deptId) {
		this.deptId = deptId;
	}
	/**
	 * 获取：部门PK
	 */
	public Long getDeptId() {
		return deptId;
	}
	/**
	 * 设置：
	 */
	public void setRealName(String realName) {
		this.realName = realName;
	}
	/**
	 * 获取：
	 */
	public String getRealName() {
		return realName;
	}
	/**
	 * 设置：从NC中取得的商机pk

	 */
	public void setNcUserId(String ncUserId) {
		this.ncUserId = ncUserId;
	}
	/**
	 * 获取：从NC中取得的商机pk

	 */
	public String getNcUserId() {
		return ncUserId;
	}
}
