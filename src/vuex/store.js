/**
 * Created by Sugar on 2017/5/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

// 注册vuex
Vue.use(Vuex)

// 初始化一些常用数据，根据vue的理念，使用到的数据都必须先进行初始化设置。
let state = {
  // 系统微信用户id
  userId: 0,
  // toast
  toast: false,
  toastMsg: '',
  toastTimer: null,
  // 侧边栏
  sidebar: {
    open: false,
    docked: true
  },
  // 搜索
  search: false,
  searchKeyword: '',
  searchResult: [],
  // 是否正在识别名片
  isScan: false,
  saving: false,
  // 详情页
  details: false,
  // 导航栏标题
  headerTitle: "查看分组",
  // ajax请求数据是否结束
  isAjax: false,
  // 当前被选中或者在查看中的名片
  activeId: 0,
  // 名片列表
  businessCardList: [],
  // 名片详情信息
  cardDetails: {},
  // 名片识别结果
  scanResult: {},
  scanCardImg: '',
  compayBusinessData: [],
  // 名片首字母列表
  // bcFirstNameList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  // 名片分组
  groupList: [],
  // 当前选择分组
  currGroup: '全部',
  currGroupId: 0
}

// 导出一个新生成的Store对象
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
