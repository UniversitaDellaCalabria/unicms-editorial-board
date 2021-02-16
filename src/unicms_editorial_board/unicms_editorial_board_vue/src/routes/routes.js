import DashboardLayout from '../layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../pages/NotFoundPage.vue'

// Admin pages
import Overview from 'src/pages/Overview.vue'
import Carousels from 'src/pages/Carousels.vue'
import CarouselNew from 'src/pages/CarouselNew.vue'
import CarouselEdit from 'src/pages/CarouselEdit.vue'
import CarouselItems from 'src/pages/CarouselItems.vue'
import CarouselItemNew from 'src/pages/CarouselItemNew.vue'
import CarouselItemEdit from 'src/pages/CarouselItemEdit.vue'
import CarouselItemLinks from 'src/pages/CarouselItemLinks.vue'
import CarouselItemLinkNew from 'src/pages/CarouselItemLinkNew.vue'
import CarouselItemLinkEdit from 'src/pages/CarouselItemLinkEdit.vue'
import CarouselItemLocalizations from 'src/pages/CarouselItemLocalizations.vue'
import CarouselItemLocalizationNew from 'src/pages/CarouselItemLocalizationNew.vue'
import CarouselItemLocalizationEdit from 'src/pages/CarouselItemLocalizationEdit.vue'
import CarouselItemLinkLocalizations from 'src/pages/CarouselItemLinkLocalizations.vue'
import CarouselItemLinkLocalizationNew from 'src/pages/CarouselItemLinkLocalizationNew.vue'
import CarouselItemLinkLocalizationEdit from 'src/pages/CarouselItemLinkLocalizationEdit.vue'
import Medias from 'src/pages/Medias.vue'
import MediaEdit from 'src/pages/MediaEdit.vue'
import MediaNew from 'src/pages/MediaNew.vue'
import MediaCollections from 'src/pages/MediaCollections.vue'
import MediaCollectionNew from 'src/pages/MediaCollectionNew.vue'
import MediaCollectionEdit from 'src/pages/MediaCollectionEdit.vue'
import MediaCollectionItems from 'src/pages/MediaCollectionItems.vue'
import MediaCollectionItemNew from 'src/pages/MediaCollectionItemNew.vue'
import MediaCollectionItemEdit from 'src/pages/MediaCollectionItemEdit.vue'
import Publications from 'src/pages/Publications.vue'
import PublicationNew from 'src/pages/PublicationNew.vue'
import PublicationEdit from 'src/pages/PublicationEdit.vue'
import PublicationAttachments from 'src/pages/PublicationAttachments.vue'
import PublicationAttachmentNew from 'src/pages/PublicationAttachmentNew.vue'
import PublicationAttachmentEdit from 'src/pages/PublicationAttachmentEdit.vue'
import PublicationGalleries from 'src/pages/PublicationGalleries.vue'
import PublicationGalleryNew from 'src/pages/PublicationGalleryNew.vue'
import PublicationGalleryEdit from 'src/pages/PublicationGalleryEdit.vue'
import PublicationLinks from 'src/pages/PublicationLinks.vue'
import PublicationLinkNew from 'src/pages/PublicationLinkNew.vue'
import PublicationLinkEdit from 'src/pages/PublicationLinkEdit.vue'
import PublicationLocalizations from 'src/pages/PublicationLocalizations.vue'
import PublicationLocalizationNew from 'src/pages/PublicationLocalizationNew.vue'
import PublicationLocalizationEdit from 'src/pages/PublicationLocalizationEdit.vue'
import Websites from 'src/pages/Websites.vue'
import Webpaths from 'src/pages/Webpaths.vue'
import WebpathNew from 'src/pages/WebpathNew.vue'
import WebpathEdit from 'src/pages/WebpathEdit.vue'
import UserProfile from 'src/pages/UserProfile.vue'
import TableList from 'src/pages/TableList.vue'
import Typography from 'src/pages/Typography.vue'
import Icons from 'src/pages/Icons.vue'
//import Maps from 'src/pages/Maps.vue'
import Notifications from 'src/pages/Notifications.vue'
import Upgrade from 'src/pages/Upgrade.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Overview,
        meta: {
            breadcrumb: 'Dashboard'
        }
      },

      // websites
      {
        path: 'websites',
        name: 'Websites',
        component: Websites,
        meta: {
            breadcrumb: {
              label: 'Websites',
              parent: 'Dashboard'
            }
        }
      },
      // webpaths
      {
        path: 'websites/:site_id/webpaths',
        name: 'Webpaths',
        component: Webpaths,
        meta: {
            breadcrumb: {
              label: 'Webpaths',
              parent: 'Websites'
            }
          },
      },
      // webpath new
      {
        path: 'websites/:site_id/webpaths/new',
        name: 'WebpathNew',
        component: WebpathNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'Webpaths'
            }
          },
      },
      // webpath detail
      {
        path: 'websites/:site_id/webpaths/:webpath_id/edit',
        name: 'WebpathEdit',
        component: WebpathEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'Webpaths'
            }
          },
      },

    // medias
      {
        path: 'medias',
        name: 'Medias',
        component: Medias,
        meta: {
            breadcrumb: {
              label: 'Medias',
              parent: 'Dashboard'
            }
        }
      },
      {
        path: 'medias/new',
        name: 'MediaNew',
        component: MediaNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'Medias'
            }
          },
      },
      {
        path: 'medias/:media_id/edit',
        name: 'MediaEdit',
        component: MediaEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'Medias'
            }
          },
      },


    // media collections
    {
        path: 'media-collections',
        name: 'MediaCollections',
        component: MediaCollections,
        meta: {
            breadcrumb: {
              label: 'Media collections',
              parent: 'Dashboard'
            }
        }
      },
    {
        path: 'media-collections-new',
        name: 'MediaCollectionNew',
        component: MediaCollectionNew,
        meta: {
            breadcrumb: {
              label: 'new',
              parent: 'MediaCollections'
            }
        }
      },
        {
        path: 'media-collections/:collection_id/edit',
        name: 'MediaCollectionEdit',
        component: MediaCollectionEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'MediaCollections'
            }
          },
      },

    // media collection items
    {
        path: 'media-collections/:collection_id/items',
        name: 'MediaCollectionItems',
        component: MediaCollectionItems,
        meta: {
            breadcrumb: {
              label: 'Media collection items',
              parent: 'MediaCollections'
            }
        }
      },
    {
        path: 'media-collections/:collection_id/items/new',
        name: 'MediaCollectionItemNew',
        component: MediaCollectionItemNew,
        meta: {
            breadcrumb: {
              label: 'new',
              parent: 'MediaCollectionItems'
            }
        }
    },
    {
        path: 'media-collections/:collection_id/items/:item_id/edit',
        name: 'MediaCollectionItemEdit',
        component: MediaCollectionItemEdit,
        meta: {
            breadcrumb: {
              label: 'edit',
              parent: 'MediaCollectionItems'
            }
        }
      },
    // carousels
      {
        path: 'carousels',
        name: 'Carousels',
        component: Carousels,
        meta: {
            breadcrumb: {
              label: 'Carousels',
              parent: 'Dashboard'
            }
        }
      },
    {
        path: 'carousels/:carousel_id/new',
        name: 'CarouselNew',
        component: CarouselNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'Carousels'
            }
          },
      },
    {
        path: 'carousels/:carousel_id/edit',
        name: 'CarouselEdit',
        component: CarouselEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'Carousels'
            }
          },
      },

    // carousel items
      {
        path: 'carousels/:carousel_id/items',
        name: 'CarouselItems',
        component: CarouselItems,
        meta: {
            breadcrumb: {
              label: 'Carousel items',
              parent: 'Carousels'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/new',
        name: 'CarouselItemNew',
        component: CarouselItemNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'CarouselItems'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:item_id/edit',
        name: 'CarouselItemEdit',
        component: CarouselItemEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'CarouselItems'
            }
        }
      },

    // carousel item links
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links',
        name: 'CarouselItemLinks',
        component: CarouselItemLinks,
        meta: {
            breadcrumb: {
              label: 'Carousel item links',
              parent: 'CarouselItems'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links/new',
        name: 'CarouselItemLinkNew',
        component: CarouselItemLinkNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'CarouselItemLinks'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links/:item_id/edit',
        name: 'CarouselItemLinkEdit',
        component: CarouselItemLinkEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'CarouselItemLinks'
            }
        }
      },
    // carousel item localizations
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/localizations',
        name: 'CarouselItemLocalizations',
        component: CarouselItemLocalizations,
        meta: {
            breadcrumb: {
              label: 'Carousel item localizations',
              parent: 'CarouselItems'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/localizations/new',
        name: 'CarouselItemLocalizationNew',
        component: CarouselItemLocalizationNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'CarouselItemLocalizations'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/localizations/:item_id/edit',
        name: 'CarouselItemLocalizationEdit',
        component: CarouselItemLocalizationEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'CarouselItemLocalizations'
            }
        }
      },
    // carousel item link localizations
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links/:carousel_item_link_id/localizations',
        name: 'CarouselItemLinkLocalizations',
        component: CarouselItemLinkLocalizations,
        meta: {
            breadcrumb: {
              label: 'Carousel item link localizations',
              parent: 'CarouselItemLinks'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links/:carousel_item_link_id/localizations/new',
        name: 'CarouselItemLinkLocalizationNew',
        component: CarouselItemLinkLocalizationNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'CarouselItemLinkLocalizations'
            }
        }
      },
      {
        path: 'carousels/:carousel_id/items/:carousel_item_id/links/:carousel_item_link_id/localizations/:item_id/edit',
        name: 'CarouselItemLinkLocalizationEdit',
        component: CarouselItemLinkLocalizationEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'CarouselItemLinkLocalizations'
            }
        }
      },

    // publications
      {
        path: 'publications',
        name: 'Publications',
        component: Publications,
        meta: {
            breadcrumb: {
              label: 'Publications',
              parent: 'Dashboard'
            }
        }
      },
    {
        path: 'publications/new',
        name: 'PublicationNew',
        component: PublicationNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'Publications'
            }
          },
    },
    {
        path: 'publications/:publication_id/edit',
        name: 'PublicationEdit',
        component: PublicationEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'Publications'
            }
          },
      },
    // publication attachments
      {
        path: 'publications/:publication_id/attachments',
        name: 'PublicationAttachments',
        component: PublicationAttachments,
        meta: {
            breadcrumb: {
              label: 'PublicationAttachments',
              parent: 'Publications'
            }
        }
      },
      {
        path: 'publications/:publication_id/attachments/new',
        name: 'PublicationAttachmentNew',
        component: PublicationAttachmentNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'PublicationAttachments'
            }
        }
      },
      {
        path: 'publications/:publication_id/attachments/:attachment_id/edit',
        name: 'PublicationAttachmentEdit',
        component: PublicationAttachmentEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'PublicationAttachments'
            }
        }
      },


    // publication links
      {
        path: 'publications/:publication_id/links',
        name: 'PublicationLinks',
        component: PublicationLinks,
        meta: {
            breadcrumb: {
              label: 'PublicationLinks',
              parent: 'Publications'
            }
        }
      },
      {
        path: 'publications/:publication_id/links/new',
        name: 'PublicationLinkNew',
        component: PublicationLinkNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'PublicationLinks'
            }
        }
      },
      {
        path: 'publications/:publication_id/links/:item_id/edit',
        name: 'PublicationLinkEdit',
        component: PublicationLinkEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'PublicationLinks'
            }
        }
      },


    // publication galleries
      {
        path: 'publications/:publication_id/galleries',
        name: 'PublicationGalleries',
        component: PublicationGalleries,
        meta: {
            breadcrumb: {
              label: 'PublicationGalleries',
              parent: 'Publications'
            }
        }
      },
      {
        path: 'publications/:publication_id/galleries/new',
        name: 'PublicationGalleryNew',
        component: PublicationGalleryNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'PublicationGalleries'
            }
        }
      },
      {
        path: 'publications/:publication_id/galleries/:gallery_id/edit',
        name: 'PublicationGalleryEdit',
        component: PublicationGalleryEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'PublicationGalleries'
            }
        }
      },

    // publication localizations
      {
        path: 'publications/:publication_id/localizations',
        name: 'PublicationLocalizations',
        component: PublicationLocalizations,
        meta: {
            breadcrumb: {
              label: 'PublicationLocalizations',
              parent: 'Publications'
            }
        }
      },
    {
        path: 'publications/:publication_id/localizations/new',
        name: 'PublicationLocalizationNew',
        component: PublicationLocalizationNew,
        meta: {
            breadcrumb: {
              label: 'New',
              parent: 'PublicationLocalizations'
            }
        }
      },
    {
        path: 'publications/:publication_id/localizations/:localization_id/edit',
        name: 'PublicationLocalizationEdit',
        component: PublicationLocalizationEdit,
        meta: {
            breadcrumb: {
              label: 'Edit',
              parent: 'PublicationLocalizations'
            }
        }
      },





      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      //{
        //path: 'maps',
        //name: 'Maps',
        //component: Maps
      //},
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'upgrade',
        name: 'Upgrade to PRO',
        component: Upgrade
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
