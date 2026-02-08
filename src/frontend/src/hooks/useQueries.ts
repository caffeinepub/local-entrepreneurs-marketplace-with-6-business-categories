import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductCategory, EntrepreneurProfile, ProductListing, ProductInquiry, UserProfile } from '../backend';

// Categories
export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Entrepreneur Profile
export function useGetProfile(profileId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<EntrepreneurProfile>({
    queryKey: ['profile', profileId?.toString()],
    queryFn: async () => {
      if (!actor || profileId === undefined) throw new Error('Actor or profileId not available');
      return actor.getProfile(profileId);
    },
    enabled: !!actor && !isFetching && profileId !== undefined,
  });
}

export function useGetProfilesByCategory(categoryId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<EntrepreneurProfile[]>({
    queryKey: ['profiles', 'category', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || categoryId === undefined) return [];
      return actor.getProfilesByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && categoryId !== undefined,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      businessName: string;
      contact: string;
      categoryId: bigint;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProfile(
        data.businessName,
        data.contact,
        data.categoryId,
        data.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}

// Products
export function useGetProduct(productId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductListing>({
    queryKey: ['product', productId?.toString()],
    queryFn: async () => {
      if (!actor || productId === undefined) throw new Error('Actor or productId not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !isFetching && productId !== undefined,
  });
}

export function useGetProductsByCategory(categoryId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductListing[]>({
    queryKey: ['products', 'category', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || categoryId === undefined) return [];
      return actor.getProductsByCategory(categoryId);
    },
    enabled: !!actor && !isFetching && categoryId !== undefined,
  });
}

export function useGetProductsByEntrepreneur(entrepreneurId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductListing[]>({
    queryKey: ['products', 'entrepreneur', entrepreneurId?.toString()],
    queryFn: async () => {
      if (!actor || entrepreneurId === undefined) return [];
      return actor.getProductsByEntrepreneur(entrepreneurId);
    },
    enabled: !!actor && !isFetching && entrepreneurId !== undefined,
  });
}

export function useCreateOrUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      entrepreneurId: bigint;
      name: string;
      description: string;
      price: bigint;
      categoryId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateProduct(
        data.entrepreneurId,
        data.name,
        data.description,
        data.price,
        data.categoryId
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
}

// Inquiries
export function useGetInquiriesByEntrepreneur(entrepreneurId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductInquiry[]>({
    queryKey: ['inquiries', 'entrepreneur', entrepreneurId?.toString()],
    queryFn: async () => {
      if (!actor || entrepreneurId === undefined) return [];
      return actor.getInquiriesByEntrepreneur(entrepreneurId);
    },
    enabled: !!actor && !isFetching && entrepreneurId !== undefined,
  });
}

export function useCreateProductInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      entrepreneurId: bigint;
      customerName: string;
      customerContact: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProductInquiry(
        data.productId,
        data.entrepreneurId,
        data.customerName,
        data.customerContact,
        data.message
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
    },
  });
}
