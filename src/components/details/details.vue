<template>
  <div class="card-result">
    <div v-if="!isAjax" style="background-color: #fff">
      <div class="gridlist">
        <mu-grid-list class="gridlist-demo">
          <mu-grid-tile titlePosition="bottom" actionPosition="right" :rows="1" :cols="2" style="height: 48px">
            <!--<img v-lazy="scanResult.new_card_url||''"/>-->
            <span slot="title"><b>{{getCardDetailGroupName}}</b></span>
            <!--<span slot="subTitle"><b>{{getCardDetailGroupName}}</b></span>-->
            <mu-flat-button v-show="!saving" :label="isEdit?'保存':'编辑'" :labelClass="'flat-label'"
                            :icon="isEdit?'assignment_turned_in':'border_color'" slot="action"
                            @click="isEdit?saveInfo():editInfo()"></mu-flat-button>
            <mu-flat-button v-show="isEdit&&!saving" :label="'取消编辑'" :labelClass="'flat-label'"
                            icon="clear" slot="action"
                            @click="cancelInfo"></mu-flat-button>
            <!--<mu-circular-progress v-show="saving" slot="action" :size="30"-->
            <!--style="margin-right: 10px"></mu-circular-progress>-->
          </mu-grid-tile>
        </mu-grid-list>
      </div>

      <div class="fieldlist">
        <mu-list-item v-for="(val,key) in getDetailsTitle" :key="key" disableRipple>
          <mu-text-field :hintText="''+BSKEY[key].split('-')[0]+'为空'"
                         :label="BSKEY[key].split('-')[0]"
                         :type="BSKEY[key].split('-')[2]"
                         :value="val"
                         v-model="scanResult[key]"
                         :multiLine="key==='new_comp'||key==='new_addr'?true:false"
                         :rowsMax="3"
                         :fullWidth="(key==='new_comp'||key==='new_addr')&&!isEdit?false:true"
                         :inputClass="'field-input'"
                         :underlineClass="'underline'"
                         :underlineFocusClass="'underlineFocus'"
                         :errorColor="'error'"
                         :iconClass="'error'"
                         :underlineShow="isEdit"
                         :disabled="!isEdit"
                         :errorText="(key==='new_comp'||key==='new_name'||key==='new_mobile')&&val.length==0?'这是必填项':''"
                         :required="key==='new_comp'||key==='new_name'||key==='new_mobile'?true:false"></mu-text-field>

          <a v-if="(key=='new_mobile'||key=='new_tel')&&val.length>0" v-show="!isEdit" :href="'tel:'+val">
            <mu-icon-button v-if="key=='new_mobile'||key=='new_tel'" icon="phone_in_talk"></mu-icon-button>
          </a>
          <a v-if="key=='new_email'&&val.length>0" v-show="!isEdit" :href="'mailto:'+val">
            <mu-icon-button v-if="key=='new_email'" icon="send"></mu-icon-button>
          </a>
          <a v-if="key=='new_name'&&val.length>0" v-show="!isEdit" href="javascript:;" style="
          position: absolute !important;
          color: #2196f3;
          line-height: 28px;
          font-weight: bold;
    top: 0;
    right: 0;
    float: right;" @click="showCardImg">查看名片</a>
          <!--<a v-if="key=='new_web'&&val.length>0" v-show="!isEdit" :href="val.indexOf('http')>-1?val:'//'+val">-->
          <!--<mu-icon-button v-if="key=='new_web'" icon="attachment"></mu-icon-button>-->
          <!--</a>-->
          <mu-icon-button v-if="key=='new_comp'" icon="info" v-show="!isEdit"
                          @click.stop="businessData(val)"></mu-icon-button>
          <a v-if="key=='new_addr'&&val.length>0" v-show="!isEdit"
             :href="domain+'/Navigation.aspx?sourceId=' + appid + '&address=' + val + '&name='">
            <mu-icon-button v-if="key=='new_addr'" icon="pin_drop"></mu-icon-button>
          </a>
        </mu-list-item>
      </div>

      <div class="options" v-show="isEdit">
        <mu-tabs>
          <!--<mu-tab value="tab1" icon="contact_phone" title="同步联系人"></mu-tab>-->
          <mu-tab value="tab2" title="选择分组" @click="showGroup"></mu-tab>
          <!--<mu-tab value="tab3" icon="contacts" title="存入通讯录"></mu-tab>-->
        </mu-tabs>
      </div>
    </div>

    <div style="background-color:transparent;margin-top: 50%;text-align: center" v-if="isAjax">
      <mu-circular-progress :size="40" :color="'474a4f'" :strokeWidth="5"></mu-circular-progress>
    </div>

    <div class="loading-mask" v-if="saving"></div>
    <div class="home-loading" v-if="saving">
      <mu-circular-progress :size="40" :color="'white!important'" :strokeWidth="5"></mu-circular-progress>
    </div>

    <!--保存确认弹窗-->
    <mu-dialog :open="dialog"
               @close="closeDialog"
               title="确认信息"
               dialogClass="result-dialog"
               bodyClass="result-dialog-body"
               :scrollable="true">
      <mu-menu>
        <mu-menu-item :title="'分组: '+getCardDetailGroupName" :disableFocusRipple="true"></mu-menu-item>
        <mu-menu-item v-for="(val,key) in getDetailsTitle"
                      :title="BSKEY[key].split('-')[0]+': ' + val"
                      :key="key"
                      :disableFocusRipple="true">
        </mu-menu-item>
      </mu-menu>
      <mu-flat-button primary label="确定并保存" @click="save" slot="actions"></mu-flat-button>
      <mu-flat-button default label="取消" @click="closeDialog" slot="actions"></mu-flat-button>
    </mu-dialog>

    <mu-dialog :open="cardImgDialog" @close="closeCardImg" dialogClass="custom-dialog">
      <img class="card-img" v-lazy="scanResult.new_card_url||''"/>
      <mu-flat-button slot="actions" primary @click="closeCardImg" label="关闭"/>
    </mu-dialog>

    <!--分组选择弹框-->
    <mu-dialog :open="groupDialog"
               @close="closeGroup"
               dialogClass="result-dialog"
               bodyClass="result-dialog-body"
               :scrollable="true">
      <mu-menu>
        <mu-menu-item v-for="(item,index) in groupList"
                      :title="item.new_name"
                      :key="index"
                      :disableFocusRipple="true"
                      @click="selectGroup(item)">

        </mu-menu-item>
      </mu-menu>
      <mu-flat-button default label="关闭" @click="closeGroup" slot="actions"></mu-flat-button>
    </mu-dialog>
  </div>
</template>
<style lang="scss">
  .result-dialog {
    max-height: 409px !important;
  }

  .result-dialog-body {
    max-height: 279px !important;
    padding: 0 !important;
    .mu-menu-item-wrapper {
      height: auto !important;
    }
    .mu-menu {
      width: 100% !important;
    }
    .mu-menu-list {
      width: 100% !important;
    }
    .mu-menu-item-title {
      white-space: normal !important;
    }
  }

  .mu-flat-button-primary {
    color: #2196f3 !important;
  }

  .gridlist {
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    /*justify-content: space-around;*/
    margin-bottom: 10px;
  }

  .flat-label {
    color: #fff !important;
    font-weight: bold;
  }

  .fieldlist {
    padding: 0 15px 81px 15px;
    background-color: #fff;
    .mu-item {
      padding: 0 !important;
    }
    .mu-icon-button {
      position: absolute !important;
      top: 0;
      right: 0;
      float: right;
      color: #2196f3;
    }
    .mu-text-field-label {
      font-weight: bold;
      z-index: 99;
    }
    .mu-text-field {
      margin-bottom: 0;
    }
    .mu-text-field-content {
      padding-bottom: 0 !important;
    }
    .mu-text-field.has-label {
      min-height: 60px;
    }
  }

  .fr-btn {
    float: right;
  }

  .field-input {
    color: #000 !important;
    font-weight: normal !important;
    opacity: 1;
  }

  .underline {
    background-color: rgba(0, 0, 0, .4) !important;
  }

  .underlineFocus {
    background-color: orange !important;
  }

  .error {
    color: #000;
  }

  .options {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 300;
  }

  .card-img {
    width: 100%;
  }

  .custom-dialog {
    width: 95% !important;
  }
</style>
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import bskey from '../../common/js/BSKEY'
  import MuListItem from "../../../node_modules/muse-ui/src/list/listItem.vue";
  import MuMenuItem from "../../../node_modules/muse-ui/src/menu/menuItem.vue";

  export default {
    components: {
      MuMenuItem,
      MuListItem
    },
    name: 'details',
    data() {
      return {
        details: {},
        editIcon: 'border_color',
        isEdit: false,
        BSKEY: bskey,
        dialog: false,
        groupDialog: false,
        cardImgDialog: false
      }
    },
    watch: {
      details(oldVal, newVal) {
        console.log(oldVal, newVal);
      }
    },
    computed: {
      ...mapState(['activeId', 'scanResult', 'isAjax', 'saving', 'groupList']),
      ...mapGetters(['getDetailsTitle', 'getCardDetailGroupName'])
    },
    methods: {
      showCardImg() {
        this.cardImgDialog = true;
      },
      closeCardImg() {
        this.cardImgDialog = false;
      },
      editInfo() {
        this.isEdit = true
      },
      saveInfo() {
        let result = this.getDetailsTitle
        let hasEmpty = false;

        Object.keys(result).forEach(key => {
          if (key === 'new_comp' || key === 'new_name' || key === 'new_mobile') {
            if (result[key] == '' || result[key] == null) {
              hasEmpty = true
            }
          }
        })

        if (this.scanResult._new_group_value == null) {
//          hasEmpty = true
        }

        if (!hasEmpty) {
//          this.dialog = true
          this.isEdit = false
          this.save();
        } else {
          this.$store.commit('showToast', {msg: '请将信息补充完整'})
        }

        console.log('getDetailsTitle', this.getDetailsTitle)
      },
      cancelInfo() {
        window.location.reload()
      },
      save() {
        this.dialog = false
        this.$store.state.saving = true
        this.$store.dispatch('updateCardDetails', {
          id: this.$route.query.id,
          details: this.getDetailsTitle,
          groupid: this.scanResult._new_group_value,
          userid: this.$store.state.userId
        })
        console.log(this.$store.state.scanResult);
      },
      closeDialog() {
        this.dialog = false
      },
      selectGroup(item) {
        this.$store.state.scanResult._new_group_value = item.new_groupid
        this.groupDialog = false
      },
      showGroup() {
        this.groupDialog = true
      },
      closeGroup() {
        this.groupDialog = false
      },
      businessData(comp) {
        if (!this.isEdit) {
          this.$router.push({path: 'business', query: {company: comp}})
        }
      }
    },
    created() {
      this.domain = this.context.Domain
      this.appid = this.context.AppId
      this.$store.state.isAjax = true
      this.$store.dispatch('getCardDetails', {id: this.$route.query.id})
    }
  }
</script>
