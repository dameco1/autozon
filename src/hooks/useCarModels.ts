import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CarVariant {
  id: string;
  make: string;
  model: string;
  variant: string;
  year_from: number;
  year_to: number | null;
  power_hp: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
}

export function useCarMakes() {
  return useQuery({
    queryKey: ["car-makes"],
    queryFn: async () => {
      const all: any[] = [];
      let from = 0;
      const PAGE = 1000;
      while (true) {
        const { data, error } = await (supabase as any)
          .from("car_models")
          .select("make")
          .order("make")
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < PAGE) break;
        from += PAGE;
      }
      const unique = [...new Set(all.map((d: any) => d.make))] as string[];
      return unique;
    },
    staleTime: Infinity,
  });
}

export function useCarModels(make: string) {
  return useQuery({
    queryKey: ["car-models", make],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("car_models")
        .select("model")
        .eq("make", make)
        .order("model");
      if (error) throw error;
      const unique = [...new Set((data as any[]).map((d) => d.model))] as string[];
      return unique;
    },
    enabled: !!make,
    staleTime: Infinity,
  });
}

export function useCarVariants(make: string, model: string) {
  return useQuery<CarVariant[]>({
    queryKey: ["car-variants", make, model],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("car_models")
        .select("*")
        .eq("make", make)
        .eq("model", model)
        .order("variant");
      if (error) throw error;
      return data as CarVariant[];
    },
    enabled: !!make && !!model,
    staleTime: Infinity,
  });
}
