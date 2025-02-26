import { IPaging } from '@/interface';
import { IUser } from '@/types/IUser';
import request from '@/utils/request';

export function fetchUserRegister({ username, password }) {
  return request.post('/user/register', {
    username,
    password,
  });
}

export function fetchQrcodeLogin({ platform, exp }) {
  return request.post<{
    login_id: string;
    exp: any;
    platform: any;
    isLogin: boolean;
    token: string;
  }>('/user/qrcode_login', {
    platform,
    exp,
  });
}

// eslint-disable-next-line
export function fetchQrcodeLoginStatus({ platform, login_id }) {
  return request.get<{
    login_id: string;
    exp: any;
    platform: any;
    isLogin: boolean;
    token: string;
  }>('/user/qrcode_login_status', {
    // eslint-disable-next-line
    params: { platform, login_id },
  });
}

export function fetchUsernameLogin({ username, password }) {
  return request.post('/user/username_login', {
    username,
    password,
  });
}
export function fetchIdLogin({ id, password }) {
  return request.post('/user/login', {
    id,
    password,
  });
}

export function fetchUserInfo() {
  return request.get<IUser>('/user/get_user_info');
}

export function fetchFindUser(userId: number) {
  return request.get(`/user/find/${userId}`);
}

export function fetchUserList(params: { orderName: string; orderBy: string }) {
  return request.get<IPaging<IUser>>('/user/list', { params });
}

// 获取用户关注列表
export function fetchUserFollowingList(params) {
  return request.get('/user_follows/following', { params });
}

// 获取用户粉丝列表
export function fetchUserFollowersList(params) {
  return request.get('/user_follows/followers', { params });
}

// 用户关注
export function fetchUserFollow({ followerId, followingId }) {
  return request.post('/user_follows/follow', { followerId, followingId });
}

// 用户取消关注
export function fetchUserUnfollow({ followerId, followingId }) {
  return request.post('/user_follows/unfollow', { followerId, followingId });
}

// 上传用户头像
export function uploadAvatar(file, userId) {
  const formData = new FormData();
  formData.append('avatar', file); // 将文件添加到 FormData 中
  formData.append('id', userId); // 将用户的 id 添加到 FormData 中

  return request.post('/user/upload_avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 设置正确的请求头
    },
  });
}

// 更新用户信息
export function updateUserInfo(params) {
  return request.put('/user/update', params);
}

// 根据关键词获取用户对应关注列表
export function searchUserFollowing(params) {
  return request.get('/user_follows/following/search', { params });
}

// 根据关键词获取用户对应粉丝列表
export function searchUserFollowers(params) {
  return request.get('/user_follows/followers/search', { params });
}

// 获取用户关注的用户及其最新直播记录
export function getFollowedUsersWithLiveRecords(params) {
  return request.get('/user_follows/following/records', { params });
}

// 获取用户关注的没有开播过的用户
export function getUsersWhoNeverStreamed(params) {
  return request.get('/user_follows/following/no_live', { params });
}
