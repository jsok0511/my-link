import { NextRequest, NextResponse } from "next/server";
import linksData from "@/data/links.json";
import { LinkItem, LinksApiResponse } from "@/types";

// In-memory clone of mock links data
const mockLinks: LinkItem[] = [...(linksData.links as LinkItem[])];

/**
 * GET /api/links
 * 지원 쿼리 파라미터:
 * - category: 'all' | 'dev' | 'career' | 'social' | 'contact' (기본값: 'all')
 * - activeOnly: 'true' | 'false' (기본값: 'false')
 * - sort: 'order' | 'popular' | 'latest' (기본값: 'order')
 * - search: 검색어 (title, subtitle, badge 대상)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const activeOnly = searchParams.get("activeOnly") === "true";
    const sort = searchParams.get("sort") || "order";
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    let filtered = [...mockLinks];

    // 1. 활성 상태 필터링
    if (activeOnly) {
      filtered = filtered.filter((item) => item.isActive);
    }

    // 2. 카테고리 필터링
    if (category !== "all") {
      filtered = filtered.filter((item) => item.category === category);
    }

    // 3. 검색어 필터링
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.subtitle.toLowerCase().includes(search) ||
          (item.badge && item.badge.toLowerCase().includes(search))
      );
    }

    // 4. 정렬
    if (sort === "popular") {
      filtered.sort((a, b) => b.clickCount - a.clickCount);
    } else if (sort === "latest") {
      filtered.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      filtered.sort((a, b) => a.order - b.order);
    }

    // 카테고리별 통계 메타데이터 생성
    const categoriesMeta = [
      { id: "all", label: "전체", count: mockLinks.length },
      {
        id: "dev",
        label: "개발",
        count: mockLinks.filter((l) => l.category === "dev").length,
      },
      {
        id: "career",
        label: "커리어",
        count: mockLinks.filter((l) => l.category === "career").length,
      },
      {
        id: "social",
        label: "소셜",
        count: mockLinks.filter((l) => l.category === "social").length,
      },
      {
        id: "contact",
        label: "연락처",
        count: mockLinks.filter((l) => l.category === "contact").length,
      },
    ];

    const response: LinksApiResponse = {
      status: "success",
      code: 200,
      message: "링크 목록을 성공적으로 불러왔어요.",
      data: filtered,
      meta: {
        totalCount: filtered.length,
        activeCount: filtered.filter((item) => item.isActive).length,
        categories: categoriesMeta,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "링크 목록을 불러오는 중 오류가 발생했어요.",
        data: [],
        meta: {
          totalCount: 0,
          activeCount: 0,
          categories: [],
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/links
 * 클릭 카운트 증가 또는 신규 Mock 링크 추가 지원
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. 클릭수 증가 액션
    if (body.action === "click" && body.linkId) {
      const targetIndex = mockLinks.findIndex((item) => item.id === body.linkId);
      if (targetIndex !== -1) {
        mockLinks[targetIndex] = {
          ...mockLinks[targetIndex],
          clickCount: mockLinks[targetIndex].clickCount + 1,
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json({
          status: "success",
          code: 200,
          message: "클릭 수가 정상적으로 반영되었어요.",
          data: mockLinks[targetIndex],
        });
      }
      return NextResponse.json(
        { status: "error", code: 404, message: "해당 링크를 찾을 수 없어요." },
        { status: 404 }
      );
    }

    // 2. 신규 링크 추가
    if (body.title && body.url) {
      const newLink: LinkItem = {
        id: `link-${Date.now()}`,
        title: body.title,
        subtitle: body.subtitle || "",
        url: body.url,
        category: body.category || "dev",
        categoryLabel:
          body.category === "career"
            ? "커리어"
            : body.category === "social"
            ? "소셜"
            : body.category === "contact"
            ? "연락처"
            : "개발",
        iconName: body.iconName || "link",
        badge: body.badge,
        isExternal: body.isExternal ?? true,
        order: mockLinks.length + 1,
        clickCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockLinks.push(newLink);

      return NextResponse.json(
        {
          status: "success",
          code: 201,
          message: "새로운 링크가 등록되었어요.",
          data: newLink,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { status: "error", code: 400, message: "필수 입력 정보가 누락되었어요." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { status: "error", code: 500, message: "요청 처리 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
