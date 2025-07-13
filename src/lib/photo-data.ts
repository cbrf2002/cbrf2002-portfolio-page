export interface Photo {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  facebookUrl: string;
}

export const photos: Photo[] = [
  {
    id: '1',
    src: 'https://scontent.fmnl3-3.fna.fbcdn.net/v/t39.30808-6/516418816_1038941545117761_3423837924558037715_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFcvxDGsrZHqCeODSNid1tncHA4UKqE8ZtwcDhQqoTxm3-5eJyNNucD5BgSZH45q5MeB5XfgX66S6Ea1q4sokCM&_nc_ohc=VI6HUikHQ2wQ7kNvwFz6q9W&_nc_oc=Adk3e8bf7A0yAHQYssS1RE4NyT6bQYPRbMpOc6G7SzKmasAU2b7ElAECpuAFaLQ6LLs&_nc_zt=23&_nc_ht=scontent.fmnl3-3.fna&_nc_gid=-ByiwdRKRvIkYUcviE56Bw&oh=00_AfRPb_gcoHkIeJWoxrMWkDSJviKH92AHUieambiJP5QrSg&oe=6872B73E',
    alt: 'Tom & Chloe 6th Birthday Shoot',
    caption: 'Tom & Chloe 6th Birthday Shoot 💛🐶\nJune 26, 2025',
    facebookUrl: 'https://www.facebook.com/share/p/1H1S2iL832/',
  },
  {
    id: '2',
    src: 'https://scontent.fmnl37-2.fna.fbcdn.net/v/t39.30808-6/509419093_1027715452907037_5119185040693860133_n.jpg?stp=dst-jpg_s600x600_tt6&_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFVAowErc5t9KkH2M5VCKAoaBT8cLq86XBoFPxwurzpcGt-0loJ2vHba0VLP-WXkFsxTcXJ7w7tguxHZjCIs5S7&_nc_ohc=QD3S_1cm9aQQ7kNvwGxmeoC&_nc_oc=Adncy4I--FhXlwyk9qdX_tzHoC2vtpLeBQLwnG3MtniIuK_z3mjF2RQzWfYjGlrIgXs&_nc_zt=23&_nc_ht=scontent.fmnl37-2.fna&_nc_gid=S5TBvT3VAf-IbZGfP17VTQ&oh=00_AfR3zwL0CNwhwV2XYYTYvC28rQmeAQUqZbBlGEim3D02eQ&oe=6872BF55',
    alt: 'Mimi at 3rd',
    caption: 'Mimi at 3rd\nBirthday Celebration Coverage at Kaybagal Central, Tagaytay City\nJune 19, 2025',
    facebookUrl: 'https://www.facebook.com/share/p/173FjXTgXY/',
  },
];
