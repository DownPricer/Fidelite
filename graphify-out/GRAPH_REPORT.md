# Graph Report - Cartefidelité  (2026-10-01)

## Corpus Check
- 662 files · ~4,778,738 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 3675 nodes · 11240 edges · 168 communities (150 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ee5ec1c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- caisse-scan.ts
- cashier-checkout.tsx
- insight-permissions.test.ts
- merchant-card-template-service.ts
- env.ts
- react
- loyalty-program.ts
- ref_next_navigation
- employee-session.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-editor-properties.tsx
- jsonOk
- requireMerchantAdmin
- loyalty-context.ts
- generate-pwa-icons.mjs
- cn
- ad-visual-workflow.ts
- clients/ui.tsx
- profile-page.tsx
- insight-period.ts
- http.ts
- google-auth.ts
- ref_next_server
- getSessionUser
- api-guard.ts
- ad-detail.tsx
- advantages-ui.tsx
- theme-provider.tsx
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- loyaltyBalanceForMode
- money.ts
- demo-routing.test.ts
- src/app/page.tsx
- compilerOptions
- WalletHome
- @prisma/client
- super-admin.test.ts
- qa-login.ts
- ref_node_path
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- tarifs/page.tsx
- demo-visual.ts
- card-enlarged-view.tsx
- loyalty-service.test.ts
- scripts
- interactive-loyalty-card.tsx
- platform-stats.ts
- google-wallet/route.ts
- wallet-hydration.test.tsx
- vitest
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- wallet-home.tsx
- staff-permissions.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- rejoindre/[slug]/page.tsx
- ref_node_fs
- unsubscribe/route.ts
- landing-header.tsx
- ads/[id]/confirm/route.ts
- stripe.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- EmployeeDetailPanel
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- profile-shared.tsx
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- customer-loyalty-overview.ts
- api-merchant-statistics-route.test.ts
- lib/campaign-worker.ts
- loyalty-commit.ts
- programme/ui.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- jsonError
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- notifications-center.tsx
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- layout-client.tsx
- ad-confirm-route.test.ts
- card-deck.tsx
- campaign-confirm-route.test.ts
- sponsored-placements.test.ts
- use-wallet-unlock-animation.ts
- bucketKey
- HourlySchedulePicker
- webhook/route.ts
- merchants-list.tsx
- next
- push.ts
- prisma.ts
- super-admin-campaign-moderation.test.ts
- MerchantDetailPage
- merchant-ad-edit.test.ts
- landing-page.test.ts
- campaign-test-mode-isolation.test.ts
- google-wallet-doctor.ts
- push-client.ts
- campaign-moderation-home.tsx
- fake-ad-db.ts
- admin-ad-fiche.test.ts
- src/app/layout.tsx
- scripts/campaign-worker.ts
- logWalletUnlock
- CampagnesPanel
- capture-super-admin.mjs
- marketing-balance.test.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- customer-history.ts
- marketing-topup-route.test.ts
- customer-preferences-route.test.ts
- discover-page.tsx
- app/ui.tsx
- solde/ui.tsx
- landing-merchant-preview.tsx
- SettingsPage
- insight-demo-data.ts
- sponsored-hours-pricing.ts
- super-admin-ad-moderation.test.ts
- SponsorWizard
- CreateMerchantWizard
- use-media-query.ts
- sponsored-selection.ts
- landing-footer.tsx
- card-template-schema.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 229 edges
2. `jsonOk()` - 203 edges
3. `requireMutatingRequest()` - 140 edges
4. `prisma` - 131 edges
5. `vitest` - 111 edges
6. `readJson()` - 104 edges
7. `react` - 102 edges
8. `clientIp()` - 100 edges
9. `userAgent()` - 96 edges
10. `@prisma/client` - 95 edges

## Surprising Connections (you probably didn't know these)
- `submit()` --indirect_call--> `schedule()`  [INFERRED]
  src/app/app/campagnes/ui.tsx → tests/ad-visual-journeys.test.ts
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (168 total, 18 thin omitted)

### Community 0 - "caisse-scan.ts"
Cohesion: 0.12
Nodes (24): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScanByClientNumber(), deriveClientNumber() (+16 more)

### Community 1 - "cashier-checkout.tsx"
Cohesion: 0.21
Nodes (14): CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), CashierScanResult, Phase, RewardCard(), statusClass() (+6 more)

### Community 2 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (71): GET(), LOYALTY_MODES, GET(), dynamic, MerchantProfilePage(), ALL_SLOTS, cardCounts(), CardsIndexPage() (+63 more)

### Community 4 - "env.ts"
Cohesion: 0.11
Nodes (11): dynamic, dynamic, assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), env (+3 more)

### Community 5 - "react"
Cohesion: 0.05
Nodes (42): ref_next_link, react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), SPACES, EmployeeLoginScreen() (+34 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (42): assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), buildScanResult(), block(), buildNextBenefit() (+34 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.10
Nodes (44): ref_next_navigation, CaissePage(), CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage() (+36 more)

### Community 8 - "employee-session.ts"
Cohesion: 0.22
Nodes (15): EmployeeLoginPage(), ProEntryPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason() (+7 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (29): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+21 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (50): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), publishValidationResult() (+42 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (42): DELETE(), POST(), DELETE(), deleteSchema, POST(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT (+34 more)

### Community 12 - "VisualPicker"
Cohesion: 0.19
Nodes (13): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), SelfVisualCropper(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onCropConfirm() (+5 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (66): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+58 more)

### Community 14 - "jsonOk"
Cohesion: 0.09
Nodes (78): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+70 more)

### Community 15 - "requireMerchantAdmin"
Cohesion: 0.14
Nodes (24): EDITABLE_STATUSES, GET(), PATCH(), GET(), POST(), GET(), GET(), sortOrder() (+16 more)

### Community 16 - "loyalty-context.ts"
Cohesion: 0.15
Nodes (24): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational() (+16 more)

### Community 17 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 18 - "cn"
Cohesion: 0.10
Nodes (25): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), icons (+17 more)

### Community 19 - "ad-visual-workflow.ts"
Cohesion: 0.09
Nodes (31): GET(), schema, GET(), GET(), PATCH(), GET(), computeAdLifecycleStatus(), AdDayStats (+23 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "profile-page.tsx"
Cohesion: 0.17
Nodes (16): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+8 more)

### Community 22 - "insight-period.ts"
Cohesion: 0.21
Nodes (21): addParisDays(), addParisMonths(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket, InsightPeriodKey, PARIS_TZ (+13 more)

### Community 23 - "http.ts"
Cohesion: 0.09
Nodes (37): POST(), POST(), dynamic, logCustomerQr(), POST(), runtime, schema, POST() (+29 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.14
Nodes (24): GET(), GET(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie(), encodeStateCookie(), GOOGLE_SCOPES, GoogleAuthIntent (+16 more)

### Community 25 - "ref_next_server"
Cohesion: 0.11
Nodes (25): ref_next_server, isProduction(), hostMatches(), hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost() (+17 more)

### Community 26 - "getSessionUser"
Cohesion: 0.21
Nodes (15): CarteIdentitePage(), AccountPage(), ParametresPage(), dynamic, NotificationsPage(), PREVIEW_BENEFITS, PREVIEW_HISTORY, PREVIEW_PROFILE_HISTORY (+7 more)

### Community 27 - "api-guard.ts"
Cohesion: 0.13
Nodes (21): POST(), GET(), GET(), DELETE(), GET(), parseUserAgent(), GET(), PERIOD_KEYS (+13 more)

### Community 28 - "ad-detail.tsx"
Cohesion: 0.05
Nodes (59): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+51 more)

### Community 29 - "advantages-ui.tsx"
Cohesion: 0.12
Nodes (16): DEMO_CONFIG, HistoricalEntitlement, emptyReward(), FieldErrors, previewLine(), REWARD_TYPES, RewardFormDialog(), handleSubmit() (+8 more)

### Community 30 - "theme-provider.tsx"
Cohesion: 0.15
Nodes (8): recharts, SuperAdminStatsPage(), StatisticsPage(), PlatformChart(), Point, THEME_COLOR, ThemeProvider(), src_components_theme_provider_usetheme

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.24
Nodes (18): POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), networkAudienceWhere() (+10 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (32): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+24 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.09
Nodes (38): zod, GET(), DELETE(), POST(), uploadSchema, GET(), POST(), uploadSchema (+30 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.17
Nodes (18): ref_next_headers, GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget() (+10 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.12
Nodes (36): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+28 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.05
Nodes (51): ref_fs_promises, ref_os, OUT, tiers, GET(), MIME, GET(), MIME (+43 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "loyaltyBalanceForMode"
Cohesion: 0.31
Nodes (14): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, resolveClientNumber() (+6 more)

### Community 44 - "money.ts"
Cohesion: 0.14
Nodes (21): AmountField(), press(), KEYS, evaluateReward(), parseRewardConditions(), RewardConditions, rewardIsStackable(), RewardStatus (+13 more)

### Community 45 - "demo-routing.test.ts"
Cohesion: 0.13
Nodes (17): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled() (+9 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "WalletHome"
Cohesion: 0.16
Nodes (22): WalletEventPayload, useWalletEvents(), connect(), disconnect(), onVisibility(), WalletHome(), googleWalletEndpointForActiveCard(), canUseSessionStorage() (+14 more)

### Community 49 - "@prisma/client"
Cohesion: 0.09
Nodes (37): @prisma/client, GET(), loadProgram(), POST(), balanceFieldForUnit(), incrementBalanceData(), legacyPointsForUnitBalance(), LoyaltyBalanceFields (+29 more)

### Community 50 - "super-admin.test.ts"
Cohesion: 0.13
Nodes (20): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+12 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (35): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+27 more)

### Community 52 - "ref_node_path"
Cohesion: 0.07
Nodes (20): ref_node_fs_promises, ref_node_path, playwright, OUT, OUT, shots, outDir, outDir (+12 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.11
Nodes (51): isGoogleWalletConfigured(), accessToken(), appLinkData(), assertConfigured(), availableRewardModules(), buildGoogleWalletIds(), buildGoogleWalletMerchantView(), cardUrl() (+43 more)

### Community 55 - "email.ts"
Cohesion: 0.22
Nodes (15): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (30): InsightRange, buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam(), getFreeMerchantStats() (+22 more)

### Community 58 - "tarifs/page.tsx"
Cohesion: 0.18
Nodes (9): HomePage(), FIDETO_MONTHLY, metadata, PACK_SETUP, TarifsPage(), PricingFaq(), QUESTIONS, resolveLandingAuthTargets() (+1 more)

### Community 59 - "demo-visual.ts"
Cohesion: 0.14
Nodes (12): PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL, DEMO_EMPLOYEE, DEMO_FIRST_NAME, DEMO_FULL_NAME (+4 more)

### Community 60 - "card-enlarged-view.tsx"
Cohesion: 0.12
Nodes (20): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), ExpandableQrCode(), handleActivate() (+12 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (28): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+20 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.23
Nodes (15): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+7 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.35
Nodes (11): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), mergeGoogleWalletDraftConfig(), parseGoogleWalletConfig() (+3 more)

### Community 66 - "wallet-hydration.test.tsx"
Cohesion: 0.11
Nodes (23): ref_react_dom_server, MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey() (+15 more)

### Community 67 - "vitest"
Cohesion: 0.08
Nodes (19): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+11 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (15): AddToGoogleWalletButton(), CardsSheet(), DiscoverIconLink(), NotificationBellLink(), LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette() (+7 more)

### Community 71 - "staff-permissions.ts"
Cohesion: 0.20
Nodes (8): ADMIN_PERMISSIONS, CASHIER_DEFAULT, CRITICAL_PERMISSION_KEYS, EMPLOYEE_FIXED_PERMISSIONS, MANAGER_DEFAULT, PERMISSION_KEYS, PERMISSION_LABELS, PermissionKey

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.12
Nodes (31): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+23 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "rejoindre/[slug]/page.tsx"
Cohesion: 0.22
Nodes (10): AppLoginPage(), CustomerLoginPage(), JoinMerchantPage(), isGoogleAuthConfigured(), isGoogleSignInEnabled(), formatEurosFromCents(), isMerchantPlanId(), MERCHANT_PLANS (+2 more)

### Community 75 - "ref_node_fs"
Cohesion: 0.09
Nodes (10): ref_node_fs, outDir, outDir, generateCustomerQrDataUrl, isCustomerQrInfrastructureError, requireMutatingRequest, requireUser, tryEnsureCustomerMembershipForSlug (+2 more)

### Community 76 - "unsubscribe/route.ts"
Cohesion: 0.14
Nodes (17): jose, bodySchema, POST(), sendOneDeliveryUnsafe(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, recordConsentEvents() (+9 more)

### Community 77 - "landing-header.tsx"
Cohesion: 0.28
Nodes (7): next-themes, MoonIcon(), SunIcon(), isInternalRoute(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.16
Nodes (17): computeAdPricing(), GET(), POST(), CAMPAIGN_PRICE_CENTS, consumeQuotaForCampaign(), priceMemberOrNetworkCampaign(), priceSponsoredAd(), PricingResult (+9 more)

### Community 79 - "stripe.ts"
Cohesion: 0.13
Nodes (26): stripe, GET(), CampaignCheckoutInput, checkoutExpiry(), clientForMode(), clients, constructStripeWebhookEvent(), createCampaignCheckoutSession() (+18 more)

### Community 80 - "super-admin-session.ts"
Cohesion: 0.08
Nodes (29): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminAdDetailPage(), SuperAdminCampagnesPage() (+21 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "qr.ts"
Cohesion: 0.17
Nodes (18): main(), prisma, requiredEnv(), upsertEmployee(), qrcode, processCaisseScan(), ensureCustomerMembershipForSlug(), ensureCustomerQrToken() (+10 more)

### Community 85 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.18
Nodes (12): adminPropose(), createAd(), ctx(), dataUrl(), fake, h, jsonRequest(), merchantRespond() (+4 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "profile-shared.tsx"
Cohesion: 0.27
Nodes (11): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), EditField, fieldLabels, PasswordStrength(), ProfileShell(), SettingsRow() (+3 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "customer-loyalty-overview.ts"
Cohesion: 0.07
Nodes (50): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+42 more)

### Community 102 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 103 - "lib/campaign-worker.ts"
Cohesion: 0.36
Nodes (9): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+1 more)

### Community 104 - "loyalty-commit.ts"
Cohesion: 0.11
Nodes (33): applyAdjustment(), applyEarnVisit(), applyRedeemReward(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName() (+25 more)

### Community 105 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.07
Nodes (46): GET(), PATCH(), GET(), POST(), POST(), schema, GET(), DELETE() (+38 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "notifications-center.tsx"
Cohesion: 0.24
Nodes (8): DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter(), markOneRead(), openNotification()

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "layout-client.tsx"
Cohesion: 0.23
Nodes (7): AppNav(), icons, isActive(), TOOLS_PREFIXES, BellItem, formatWhen(), NotificationBell()

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.13
Nodes (12): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+4 more)

### Community 122 - "card-deck.tsx"
Cohesion: 0.18
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "sponsored-placements.test.ts"
Cohesion: 0.16
Nodes (14): GET(), GET(), isSafeAdUrl(), parsePlacement(), publicSponsored(), click(), END, fake (+6 more)

### Community 125 - "use-wallet-unlock-animation.ts"
Cohesion: 0.21
Nodes (16): isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), cardFromUnlockPayload(), fetchUnlockCardDetail(), isUnlockCardReadyForReveal(), parseTemplateFromPayload() (+8 more)

### Community 126 - "bucketKey"
Cohesion: 0.53
Nodes (6): bucketKey(), enumerateBucketKeys(), buildCohorts(), buildComparison(), buildFrequentation(), fillSeries()

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.17
Nodes (10): addDaysToDateInput(), formatHourRange(), HourlySchedulePicker(), addDay(), hourSelectOptions(), hoursToSlots(), scheduleDayError(), slotLabel() (+2 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.20
Nodes (16): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+8 more)

### Community 129 - "merchants-list.tsx"
Cohesion: 0.16
Nodes (13): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), SuperAdminMerchantsPage(), ACTION_DESCRIPTION (+5 more)

### Community 130 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 131 - "push.ts"
Cohesion: 0.29
Nodes (8): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser(), WebPushNotConfiguredError

### Community 132 - "prisma.ts"
Cohesion: 0.10
Nodes (27): schema, GET(), POST(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET() (+19 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 135 - "merchant-ad-edit.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindFirst, adRequestUpdate, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 136 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 137 - "campaign-test-mode-isolation.test.ts"
Cohesion: 0.13
Nodes (14): adEventCreate, adRequestFindMany, adRequestFindUnique, campaignDeliveryCreateMany, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany, inAppNotificationCreate (+6 more)

### Community 138 - "google-wallet-doctor.ts"
Cohesion: 0.24
Nodes (11): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert (+3 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 141 - "fake-ad-db.ts"
Cohesion: 0.31
Nodes (10): applyUpdate(), createFakeAdDb(), hydrate(), model(), match(), matchValue(), merchantInfo, nextId() (+2 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.14
Nodes (12): ref_sharp, files, INPUT_DIR, adminStage(), createAd(), ctx(), fake, h (+4 more)

### Community 143 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

### Community 144 - "scripts/campaign-worker.ts"
Cohesion: 0.60
Nodes (5): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick()

### Community 145 - "logWalletUnlock"
Cohesion: 0.29
Nodes (8): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), shouldSendSseEvent(), logWalletUnlock(), UnlockLogContext, UnlockLogStep

### Community 146 - "CampagnesPanel"
Cohesion: 0.18
Nodes (4): audienceDisplay(), CampagnesPanel(), CampaignWizard(), statusTone()

### Community 148 - "marketing-balance.test.ts"
Cohesion: 0.31
Nodes (7): Entry, makeTx(), Mode, snapshot(), state, transaction(), uniqueViolation()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.16
Nodes (20): GET(), POST(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate() (+12 more)

### Community 151 - "customer-history.ts"
Cohesion: 0.32
Nodes (6): BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry, mapLoyaltyCategory(), mapLoyaltyTone()

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 153 - "customer-preferences-route.test.ts"
Cohesion: 0.09
Nodes (16): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, basePrefs, consentEventCreateMany, customerPreferencesCreate (+8 more)

### Community 154 - "discover-page.tsx"
Cohesion: 0.33
Nodes (3): DiscoverPage(), Merchant, SponsoredSlot()

### Community 155 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 156 - "solde/ui.tsx"
Cohesion: 0.22
Nodes (13): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, formatCents() (+5 more)

### Community 157 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 158 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

### Community 160 - "sponsored-hours-pricing.ts"
Cohesion: 0.20
Nodes (9): slotAmountCents(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, rateForParisHour(), SPONSORED_HOUR_RATE_CENTS, SponsoredDayBreakdown, SponsoredDaySelection (+1 more)

### Community 161 - "super-admin-ad-moderation.test.ts"
Cohesion: 0.22
Nodes (6): adRequestFindUnique, adRequestUpdate, campaignUpdate, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 162 - "SponsorWizard"
Cohesion: 0.40
Nodes (3): estimateSponsorPricing(), SponsorWizard(), submit()

### Community 163 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 166 - "sponsored-selection.ts"
Cohesion: 0.16
Nodes (18): AdCandidate, CustomerZone, GLOBAL_COOLDOWN_MS, IMPRESSION_DEDUPE_MS, inAudience(), isAdEligibleForCustomer(), isEligibleNow(), isPaidOrFunded() (+10 more)

### Community 172 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 173 - "card-template-schema.ts"
Cohesion: 0.10
Nodes (19): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+11 more)

## Knowledge Gaps
- **945 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+940 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `caisse-scan.ts`, `webhook/route.ts`, `insight-permissions.test.ts`, `merchant-card-template-service.ts`, `prisma.ts`, `env.ts`, `loyalty-program.ts`, `ref_next_navigation`, `react`, `campaign-test-mode-isolation.test.ts`, `google-wallet-doctor.ts`, `loyalty-widget.ts`, `landing-page.test.ts`, `card-editor-properties.tsx`, `admin-ad-fiche.test.ts`, `merchant-ad-edit.test.ts`, `loyalty-context.ts`, `push-client.ts`, `loyalty-widget-view.tsx`, `ad-visual-workflow.ts`, `marketing-balance.test.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `http.ts`, `google-auth.ts`, `customer-preferences-route.test.ts`, `ref_next_server`, `insight-period.ts`, `marketing-topup-route.test.ts`, `super-admin-campaign-moderation.test.ts`, `theme-provider.tsx`, `super-admin-ad-moderation.test.ts`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `money.ts`, `demo-routing.test.ts`, `@prisma/client`, `super-admin.test.ts`, `qa-login.ts`, `email.ts`, `insight-stats.ts`, `tarifs/page.tsx`, `card-enlarged-view.tsx`, `loyalty-service.test.ts`, `platform-stats.ts`, `wallet-hydration.test.tsx`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `rejoindre/[slug]/page.tsx`, `ref_node_fs`, `unsubscribe/route.ts`, `ads/[id]/confirm/route.ts`, `stripe.ts`, `super-admin-session.ts`, `qr.ts`, `ad-visual-journeys.test.ts`, `customer-loyalty-overview.ts`, `api-merchant-statistics-route.test.ts`, `loyalty-commit.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `card-deck.tsx`, `campaign-confirm-route.test.ts`, `sponsored-placements.test.ts`, `use-wallet-unlock-animation.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `webhook/route.ts`, `cashier-checkout.tsx`, `merchant-card-template-service.ts`, `prisma.ts`, `react`, `loyalty-program.ts`, `ref_next_navigation`, `employee-session.ts`, `env.ts`, `loyalty-widget.ts`, `card-editor-properties.tsx`, `jsonOk`, `requireMerchantAdmin`, `loyalty-context.ts`, `ad-visual-workflow.ts`, `employee-invitation-service.ts`, `http.ts`, `customer-history.ts`, `google-auth.ts`, `api-guard.ts`, `advantages-ui.tsx`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `sponsored-selection.ts`, `money.ts`, `super-admin.test.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `wallet-home.tsx`, `staff-permissions.ts`, `merchant-card-renderer.tsx`, `unsubscribe/route.ts`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `qr.ts`, `profile-shared.tsx`, `customer-loyalty-overview.ts`, `lib/campaign-worker.ts`, `loyalty-commit.ts`, `programme/ui.tsx`, `jsonError`, `use-wallet-unlock-animation.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `merchants-list.tsx`, `cashier-checkout.tsx`, `merchant-card-template-service.ts`, `campaign-moderation-home.tsx`, `card-editor-properties.tsx`, `src/app/layout.tsx`, `loyalty-context.ts`, `cn`, `clients/ui.tsx`, `profile-page.tsx`, `discover-page.tsx`, `app/ui.tsx`, `ad-detail.tsx`, `advantages-ui.tsx`, `solde/ui.tsx`, `theme-provider.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `use-media-query.ts`, `scan/ui.tsx`, `card-template-schema.ts`, `src/app/page.tsx`, `WalletHome`, `qa-login.ts`, `tarifs/page.tsx`, `card-enlarged-view.tsx`, `interactive-loyalty-card.tsx`, `wallet-hydration.test.tsx`, `wallet-home.tsx`, `merchant-card-renderer.tsx`, `landing-header.tsx`, `profile-shared.tsx`, `campagnes/ui.tsx`, `customer-loyalty-overview.ts`, `programme/ui.tsx`, `notifications-center.tsx`, `layout-client.tsx`, `card-deck.tsx`, `use-wallet-unlock-animation.ts`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _945 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `caisse-scan.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11586452762923351 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052100840336134456 - nodes in this community are weakly interconnected._
- **Should `env.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10826210826210826 - nodes in this community are weakly interconnected._