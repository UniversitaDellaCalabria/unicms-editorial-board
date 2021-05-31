<template>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon
                                    icon="collection-play"
                                    scale="0.8">
                                </b-icon>
                                Carousels
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="carousels.count">
                                    <li v-for="carousel in carousels.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'CarouselEdit',
                                                   params: { carousel_id: carousel.id}}">
                                            {{ carousel.name }}
                                        </router-link
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            title="active"
                                            v-if="carousel.is_active">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="danger"
                                            title="not active"
                                            v-else>
                                        </b-icon>
                                        <br>
                                        <small>{{ $date_formatter(carousel.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'CarouselNew'}"
                                class="btn btn-success">
                                Add new carousel now
                            </router-link>
                        </template>
                    </b-card>
                </div>

                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon
                                    icon="folder"
                                    scale="0.8">
                                </b-icon>
                                Media
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="media.count">
                                    <li v-for="m in media.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'MediaEdit',
                                                   params: { media_id: m.id}}">
                                            {{ m.title }}
                                        </router-link>
                                        <br>
                                        <small>{{ $date_formatter(m.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'MediaNew'}"
                                class="btn btn-success">
                                Add new media now
                            </router-link>
                        </template>
                    </b-card>
                </div>

                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon
                                    icon="menu-button-wide-fill"
                                    scale="0.8">
                                </b-icon>
                                Menu
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="menus.count">
                                    <li v-for="menu in menus.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'MenuEdit',
                                                   params: { menu_id: menu.id}}">
                                            {{ menu.name }}
                                        </router-link>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            title="active"
                                            v-if="menu.is_active">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="danger"
                                            title="not active"
                                            v-else>
                                        </b-icon>
                                        <br>
                                        <small>{{ $date_formatter(menu.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'MenuNew'}"
                                class="btn btn-success">
                                Add new menu now
                            </router-link>
                        </template>
                    </b-card>
                </div>

                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon
                                    icon="columns-gap"
                                    scale="0.8">
                                </b-icon>
                                Pages
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="pages.count">
                                    <li v-for="page in pages.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'WebpathPageEdit',
                                                   params: { site_id: page.webpath.site,
                                                             webpath_id: page.webpath.id,
                                                             page_id: page.id}}">
                                            {{ page.name }}
                                        </router-link>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            title="active"
                                            v-if="page.is_active">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="danger"
                                            title="not active"
                                            v-else>
                                        </b-icon>
                                        <b-icon
                                            class="ml-1"
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            v-if="page.state='published'"
                                            title="published">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="warning"
                                            title="draft"
                                            v-else>
                                        </b-icon>
                                        <br>
                                        Webpath: {{ page.webpath.full_name }}
                                        <br>
                                        <small>{{ $date_formatter(page.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'Websites'}"
                                class="btn btn-info">
                                Go to websites
                            </router-link>
                        </template>
                    </b-card>
                </div>

                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon
                                    icon="file-earmark-text"
                                    scale="0.8">
                                </b-icon>
                                Publications
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="publications.count">
                                    <li v-for="publication in publications.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'PublicationEdit',
                                                   params: { publication_id: publication.id}}">
                                            {{ publication.full_name }}
                                        </router-link>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            title="active"
                                            v-if="publication.is_active">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="danger"
                                            title="not active"
                                            v-else>
                                        </b-icon>
                                        <br>
                                        <small>{{ $date_formatter(publication.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'PublicationNew'}"
                                class="btn btn-success">
                                Add new publication now
                            </router-link>
                        </template>
                    </b-card>
                </div>

                <div class="col-lg-4 col-md-6 col-sm-12 mb-3"">
                    <b-card>
                        <b-card-text>
                            <h4 class="mt-2 mb-3">
                                <b-icon icon="globe" scale="0.8"></b-icon>
                                Webpaths
                            </h4>
                            <hr>
                            <p class="mt-3">
                                <ul v-if="webpaths.count">
                                    <li v-for="webpath in webpaths.results.slice(0, 5)">
                                        <router-link
                                            :to="{ name: 'WebpathEdit',
                                                   params: { site_id: webpath.site,
                                                             webpath_id: webpath.id }}">
                                            {{ webpath.full_name }}
                                        </router-link>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="success"
                                            title="active"
                                            v-if="webpath.is_active">
                                        </b-icon>
                                        <b-icon
                                            icon="circle-fill"
                                            font-scale="0.6"
                                            variant="danger"
                                            title="not active"
                                            v-else>
                                        </b-icon>
                                        <br>
                                        <small>{{ $date_formatter(webpath.created)}}</small>
                                    </li>
                                </ul>
                                <span v-else>-</span>
                            </p>
                        </b-card-text>
                        <template #footer>
                            <router-link
                                :to="{ name: 'Websites'}"
                                class="btn btn-info">
                                Go to websites
                            </router-link>
                        </template>
                    </b-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            current_user: '',
            carousels: [],
            media: [],
            menus: [],
            pages: [],
            publications: [],
            webpaths: [],

            api_carousel: '/api/editorial-board/carousels/',
            api_media: '/api/editorial-board/medias/',
            api_menu: '/api/editorial-board/menus/',
            api_page: '/api/editorial-board/pages/',
            api_publication: '/api/editorial-board/publications/',
            api_page: '/api/editorial-board/sites/webpaths/pages/',
            api_webpath: '/api/editorial-board/sites/webpaths/',
        }
    },
    methods: {
        getCurrentUserID(){
            this.axios
                .get('/api/editorial-board/users/current/')
                .then(response => {
                    this.current_user = response.data[0];
                    this.callApis();
                })
        },
        callCarouselApi(filter=''){
            this.axios
                .get(this.api_carousel + filter)
                .then(response => {
                    this.carousels = response.data;
                })

        },
        callMediaApi(filter=''){
            this.axios
                .get(this.api_media + filter)
                .then(response => {
                    this.media = response.data;
                })

        },
        callMenuApi(filter=''){
            this.axios
                .get(this.api_menu + filter)
                .then(response => {
                    this.menus = response.data;
                })

        },
        callPageApi(filter=''){
            this.axios
                .get(this.api_page + filter)
                .then(response => {
                    this.pages = response.data;
                })

        },
        callPublicationApi(filter=''){
            this.axios
                .get(this.api_publication + filter)
                .then(response => {
                    this.publications = response.data;
                })

        },
        callWebpathApi(filter=''){
            this.axios
                .get(this.api_webpath + filter)
                .then(response => {
                    this.webpaths = response.data;
                })

        },
        callApis(){
            let filter = '?created_by=' + this.current_user + '&ordering=-created'
            this.callCarouselApi(filter)
            this.callMediaApi(filter)
            this.callMenuApi(filter)
            this.callPageApi(filter)
            this.callPublicationApi(filter)
            this.callWebpathApi(filter)
        }
    },
    mounted() {
        this.getCurrentUserID()
    }
}
</script>
