import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const AnnouncementApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ks-proxy.dev.kyberengineering.io/geckoterminal',
  }),
  endpoints: builder => ({
    getAnnouncements: builder.query<any, string>({
      query: () => ({
        url: '/api/p1/search',
        params: {},
      }),
    }),
    getPrivateAnnouncements: builder.query<any, string>({
      query: () => ({
        url: '/api/p1/search',
        params: {},
      }),
    }),
  }),
})

export default AnnouncementApi
