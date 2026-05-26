<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="vi">
      <head>
        <title>XML Sitemap | Ắc Quy HN</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          *, *::before, *::after { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                         "Helvetica Neue", Arial, sans-serif;
            background: #f3f4f6;
            color: #111827;
            font-size: 14px;
            line-height: 1.5;
          }
          .container { max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
          header.hero {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
            color: #fff;
            border-radius: 16px;
            padding: 24px 28px;
            margin-bottom: 16px;
            box-shadow: 0 4px 16px rgba(30, 58, 138, 0.15);
          }
          header.hero h1 {
            margin: 0 0 6px;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.01em;
          }
          header.hero p {
            margin: 0;
            opacity: 0.9;
            font-size: 13px;
          }
          .stats {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 16px;
          }
          .stat {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 12px 16px;
            min-width: 140px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            font-weight: 600;
          }
          .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: #1e40af;
            margin-top: 2px;
          }
          .table-wrap {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          table { width: 100%; border-collapse: collapse; }
          thead { background: #f9fafb; }
          th {
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: #6b7280;
            font-weight: 600;
            padding: 10px 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          th.right, td.right { text-align: right; }
          th.center, td.center { text-align: center; }
          tbody tr {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 120ms ease;
          }
          tbody tr:last-child { border-bottom: none; }
          tbody tr:hover { background: #f9fafb; }
          td {
            padding: 12px 16px;
            font-size: 13px;
          }
          td.idx {
            color: #9ca3af;
            font-variant-numeric: tabular-nums;
            width: 56px;
          }
          td.url a {
            color: #1d4ed8;
            text-decoration: none;
            word-break: break-all;
          }
          td.url a:hover { text-decoration: underline; }
          td.meta {
            color: #6b7280;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
            font-size: 12px;
          }
          .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
            background: #eff6ff;
            color: #1e40af;
          }
          footer {
            margin-top: 16px;
            padding: 14px 16px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          footer a { color: #1d4ed8; text-decoration: none; }
          @media (max-width: 640px) {
            header.hero { padding: 18px 20px; }
            header.hero h1 { font-size: 18px; }
            th, td { padding: 10px 12px; }
            td.idx { width: 36px; }
            .stat { min-width: 0; flex: 1; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="hero">
            <h1>XML Sitemap</h1>
            <p>by Noravn — Cung cấp thiết bị, vật tư và dịch vụ lắp đặt chống sét, tiếp địa.</p>
          </header>

          <div class="stats">
            <div class="stat">
              <div class="stat-label">Tổng số URL</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </div>
            </div>
            <div class="stat">
              <div class="stat-label">Cập nhật mới nhất</div>
              <div class="stat-value" style="font-size: 14px;">
                <xsl:value-of
                  select="substring(sitemap:urlset/sitemap:url[1]/sitemap:lastmod, 1, 10)"/>
              </div>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th class="right">#</th>
                  <th>URL</th>
                  <th class="right">Cập nhật</th>
                  <th class="center">Tần suất</th>
                  <th class="right">Ưu tiên</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td class="idx right">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td class="url">
                      <a href="{sitemap:loc}">
                        <xsl:value-of select="sitemap:loc"/>
                      </a>
                    </td>
                    <td class="meta right">
                      <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                    </td>
                    <td class="meta center">
                      <xsl:choose>
                        <xsl:when test="sitemap:changefreq">
                          <span class="badge">
                            <xsl:value-of select="sitemap:changefreq"/>
                          </span>
                        </xsl:when>
                        <xsl:otherwise>—</xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="meta right">
                      <xsl:value-of select="sitemap:priority"/>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated by <a href="/">acquyhnsaigon.com</a> · sitemap.xml
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
