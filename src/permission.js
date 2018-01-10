import React from 'react';
import { Route, Switch, Redirect, Link } from 'dva/router';
import { Menu, Icon } from 'antd';
import { DashBoard, List, Nav21, Nav22, Protected } from "./routes";

const { Item: MenuItem, SubMenu } = Menu
// 仅包含LayoutContent(或菜单)路由, 不含Content内部嵌套
const routes = [
  {
    path: '/dashboard',
    title: '首页',
    icon: 'dashboard',
    component: DashBoard,
    // exact: true,
    strict: true,
  },
  {
    // path: '/menu1', // 好像没什么用
    title: '主菜单1', // 有子路由的会渲染成SubMenu/Switch
    subRoutes: [
      {
        path: '/list',
        title: '列表示例',
        component: List,
        exact: true,
      },
      {
        // path: '/nav2',
        title: '递归嵌套',
        subRoutes: [
          {
            path: '/nav2/1',
            component: Nav21,
            exact: true,
          },
          {
            path: '/nav2/2',
            component: Nav22,
            exact: true,
          },
        ],
      },
    ],
  },
  {
    path: '/protected',
    title: 'WTF?',
    // roles: ['admin'],
    component: Protected,
  },
  {
    path: '/',
    exact: true,
    redirect: '/login',
  },
  {
    path: '*',
    redirect: '/404',
  }
]

const route2Route = ({
  subRoutes = [],
  redirect,
  path,
  ...rest
},
  index) => {
  if (redirect) {
    console.log(redirect);
    return <Redirect key={index} from={path} to={redirect} />
  }
  // todo 获取当前匹配的所有路由, 形如[{ path: '/menu1' }, { path: '/submenu1' }] 以拼凑path/设置默认高亮/面包屑
  // bug component不能显示, Switch/SubMenu生成重复?
  return (subRoutes.length > 0
    ? <Switch key={index}>
      {subRoutes.map(route2Route)}
    </Switch>
    : <Route key={index} path={path} {...rest} />)
  // todo ProtectedRoute
}

const route2Menu = ({
  path,
  redirect,
  subRoutes = [],
  title = "Some Title",
  icon = "question-circle-o"
}, index) => {
  if (redirect) {
    return null
  }
  return (
    subRoutes.length ?
      <SubMenu
        key={title + index}
        title={<span><Icon type={icon} /><span>{title}</span></span>}
      >
        {subRoutes.map(route2Menu)}
      </SubMenu> :
      <MenuItem key={path}>
        {/* todo key和props的key重复? */}
        <Link to={path}><Icon type={icon} /><span>{title}</span></Link>
      </MenuItem>
  )
}

function LayoutContentRoutes() {
  return (
    <Switch>
      {routes.map(route2Route)}
    </Switch>
  )
}

function Menus({ theme, mode, selectedKeys }) {
  return (
    <Menu theme={theme} mode={mode} selectedKeys={selectedKeys}>
      {routes.map(route2Menu)}
    </Menu>
  )
}

export { LayoutContentRoutes, Menus }
