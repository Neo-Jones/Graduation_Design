<template>
    <div class="list">
        <Side :isInList='true'></Side>
        <div class="list__loading" v-if="isLoading">
            <Loading :loadingMsg='loadingMsg'></Loading>
        </div>
        <ul class="list__article">
            <li class="list__article__filterMsg" v-if="(selectTags.length !== 0)">
                筛选
                <span>{{filterMsg}}</span>
                分类
            </li>
            <template v-if="posts.length!==0 && isLoading == false">
                <li v-for="article in posts" class="list__article__item" :key="article.id">
                    <h1 class="list__article__item__title">
                        <router-link :to="'article/'+article.id">{{ article.title }}</router-link>
                    </h1>
                    <div class="list__article__item__info">
                        <p class="list__article__item__time">{{article.createTime}}</p>
                        <div class="list__article__item__abstract markdown-body" v-html="compiledMarkdown(article.abstract)"></div>
                        <!-- <span v-for="tag in article.tags"> {{tag.name}}</span> -->
                        <p class="list__article__item__more">
                            <router-link :to="'/article/'+article.id" class="continue-reading">阅读全文...</router-link>
                            <span>
                                <i class="fa fa-eye" aria-hidden="true"></i>&nbsp;&nbsp;{{ article.readed }}</span>
                        </p>
                    </div>
                </li>
                <Pagination :curPage='curPage' :allPage='allPage' @changePage='changePage'></Pagination>
            </template>
            <div v-if="posts.length==0 && isLoading==false" class="msg-box">
                <p>暂时没有相关文章</p>
            </div>
        </ul>
    </div>
</template>

<script>
import Pagination from "publicComponents/Pagination.vue";
import Loading from "publicComponents/Loading.vue";
import Side from "./common/Side.vue";
import articleApi from "api/article.js";
import marked from "lib/marked.js";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "list",
  data() {
    return {
      isLoading: false,
      value: 1,
      loadingMsg: "加载中..."
    };
  },
  computed: {
    ...mapGetters([
      "posts",
      "tags",
      "curPage",
      "allPage",
      "selectTags",
      "searchTags",
      "currentPost"
    ]),
    filterMsg() {
      let msg = "";
      this.selectTags.forEach(item => {
        msg += item.name + "、";
      });
      return msg.replace(/、$/, "");
    }
  },
  components: {
    Pagination,
    Side,
    Loading
  },
  created() {},
  beforeMount() {
    scrollTo(0, 0);
    // 用来判断是否有数据，有数据就不再请求了
    if (this.currentPost.id === "") {
      // 这句话说明不是从文章详细页过来的
      return;
    }
    this.isLoading = true;
    this.getAllPosts({ page: this.$store.state.route.params.page }).then(() => {
      this.isLoading = false;
    });
  },
  mounted() {},
  preFetch(store) {
    store.dispatch("getAllTags");
    return store
      .dispatch("getAllPosts", { page: store.state.route.params.page })
      .then(() => {});
  },
  methods: {
    ...mapActions(["getAllPosts", "getAllTags"]),
    compiledMarkdown(value) {
      return marked(value);
    },
    changePage(cur) {
      this.isLoading = true;
      this.$router.push("/page/" + cur);
      this.getAllPosts({ tag: this.searchTags, page: cur }).then(() => {
        this.isLoading = false;
      });
    }
  },
  watch: {
    selectTags() {
      this.isLoading = true;
      this.getAllPosts({
        tag: this.searchTags
      }).then(() => {
        this.isLoading = false;
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/_settings.styl';

.list {
    padding: 10px;
    max-width: 75%;
    min-height: 720px;
    margin: 0 auto;
    padding-top: 85px;
    background-color: $content_color;
    overflow: auto;
    zoom: 1;

    &__article {
        list-style: none;
        margin-left: 250px;
        margin-right: 10px;
    }

    &__article__item {
        margin: 0 auto;
        padding: 10px;
        margin-bottom: 30px;

        &:hover {
            -moz-box-shadow: 0 0 15px $grey-shadow;
            -webkit-box-shadow: 0 0 15px $grey-shadow;
            box-shadow: 0 0 15px $grey-shadow;
        }
    }

    &__article__item__title {
        font-size: 24px;
        word-break: break-all;

        a {
            text-decoration: none;
            color: black;
        }
    }

    &__article__item__time {
        color: #7f8c8d;
        font-weight: 400;
        margin-bottom: 10px;
        margin-top: 2px;
    }

    &__article__item__abstract {
        margin-bottom: 5px;
        // text-align: justify;
    }

    &__article__item__more {
        margin: 15px 15px 0 0;
        display: flex;
        justify-content: space-between;

        span {
            color: $grey-font;
        }
    }

    .continue-reading {
        text-decoration: none;
        // color: #0366d6;
        color: $theme-color;
    }

    &__article__filterMsg {
        font-size: 20px;
        text-align: center;
        margin-bottom: 15px;

        span {
            color: $blue;
        }
    }

    &__loading {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 200px;
        margin-left: -(@width / 2) + 125;
        margin-top: -(@height / 2) + 60;
    }

    .msg-box {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 200px;
        height: 200px;
        margin-left: -(@width / 2) + 125;
        margin-top: -(@height / 2) + 60;
        text-align: center;
        color: #bfbfbf;
    }
}

@media screen and (max-width: 850px) {
    .list {
        position: relative;
        padding-top: 80px;
        max-width: 850px;

        &__article__item {
            margin-bottom: 10px;
        }

        &__article {
            margin-left: 0;
        }

        &__article__filterMsg {
            font-size: 18px;
        }

        .msg-box {
            position: absolute;
            top: 250px;
            left: 50%;
            width: 300px;
            margin-left: -(@width / 2);
        }

        &__loading {
            position: absolute;
            top: 250px;
            left: 50%;
            width: 300px;
            margin-left: -(@width / 2);
        }
    }
}
</style>
