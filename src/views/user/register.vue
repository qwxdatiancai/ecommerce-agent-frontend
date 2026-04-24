<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h3 class="title">用户注册</h3>
      </div>
      <!--   用户名   -->
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="0"
          auto-complete="new-password"
        />
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="email"
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="new-password"
        />
      </el-form-item>
      <!--   密码   -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >
        注册
      </el-button>

    </el-form>
  </div>
</template>

<script>

import { validEmail } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的用户邮箱'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        user_type: '0'
      },
      loginRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 显示密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录按钮事件回调
    handleRegister() {
      const _this = this
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          _this.loading = true
          const data = {
            username: _this.registerForm.username,
            email: _this.registerForm.email,
            password: _this.registerForm.password,
            user_type: _this.registerForm.user_type
          }
          _this.$store.dispatch('register', data).then(() => {
            _this.loading = false
            _this.$message.success('注册成功，即将跳转到登录页面')
            _this.$router.push('/login')
          }).catch(() => {
            _this.loading = false
            _this.$message.error('注册失败，请联系管理员')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
  -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &::-webkit-input-placeholder {
        color: orange;
        font-size: 20px;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgb(105, 180, 177);
    background: #F3DBAE19;
    border-radius: 10px;
    color: #20a0ff;
  }

  .user_type_radio_group{

    .el-radio {
      margin-left: 10px;
      color: #fff;

      .el-radio__label {
        font-size: 20px;
        color: #fff;
      }
    }

  }
}
</style>

<style lang="scss" scoped>

// 局部样式定义

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-image: url("../../assets/view_images/avatar.jpg");
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 360px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: deepskyblue;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 35px;
      color: white;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
