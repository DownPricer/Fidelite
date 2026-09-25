# Graph Report - Cartefidelité  (2026-09-25)

## Corpus Check
- 599 files · ~4,733,480 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: (none) 6, .example 4, .css 3)

## Summary
- 3216 nodes · 9864 edges · 157 communities (137 shown, 20 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f215514d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- insight-period.ts
- card-template-schema.ts
- rbac.ts
- merchant-card-template-service.ts
- next
- react
- loyalty-engine.ts
- ref_next_navigation
- fife-life/merchant-detail.tsx
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- session.ts
- card-editor-properties.tsx
- requireMutatingRequest
- loyalty-labels.ts
- prisma.ts
- wallet-hydration.test.tsx
- merchant-ui.tsx
- use-wallet-unlock-animation.ts
- outils/ui.tsx
- profile-page.tsx
- cashier-checkout.tsx
- loyaltyBalanceForMode
- google-auth.ts
- env.ts
- jsonOk
- qr-input.ts
- loyalty-commit.ts
- programme/ui.tsx
- caisse-client-number.test.ts
- create-super-admin.ts
- campaigns/[id]/confirm/route.ts
- card-editor.tsx
- package.json
- [id]/merchant-detail.tsx
- statistiques-panel.tsx
- api-merchant-statistics-route.test.ts
- demo-session.ts
- What You Must Do When Invoked
- scan/ui.tsx
- media-storage.ts
- loyalty-commit.test.ts
- card-enlarged-view.tsx
- ref_fs_promises
- employee-demo-server.ts
- src/app/page.tsx
- compilerOptions
- wallet-event-dedup.ts
- loyalty-program-publication.ts
- wallet-home.tsx
- qa-login.ts
- playwright
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- app/ui.tsx
- demo-visual.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- qr-cache.ts
- platform-stats.ts
- google-wallet/route.ts
- resolveMediaFilePath
- loyalty-program.ts
- stripe-webhook-marketing.test.ts
- stripe-webhook-route.test.ts
- ref_node_path
- merchants-list.tsx
- @prisma/client
- AdvantagesEditor
- verify-viewports.mjs
- caisse-scan.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- MerchantDetailPage
- stripe.ts
- layout-shell.tsx
- cartes.js
- Fideto
- docker-entrypoint.sh
- qr.ts
- merchant-card-renderer.tsx
- customer-preferences-route.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- super-admin-session.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- vitest
- merchant-app-access.ts
- generate-pwa-icons.mjs
- src/app/layout.tsx
- landing-header.tsx
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
- employee-session.ts
- insight-definitions.ts
- cn
- ad-confirm-route.test.ts
- loyalty-cards-capture.mjs
- campaign-confirm-route.test.ts
- resolvePublishedMerchantCardTemplate
- landing-page.test.ts
- [kind]/route.ts
- merchant-card-finish.test.ts
- webhook/route.ts
- lib/campaign-worker.ts
- discover-page.tsx
- cards-index.tsx
- customer-push-route.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- media-storage-guard.ts
- campaign-crud-routes.test.ts
- push-client.ts
- resolveLandingAuthTargets
- loyalty-reward-removal.ts
- landing-merchant-preview.tsx
- requireMerchantAdmin
- CardEditorBackgroundCrop
- CampaignWizard
- use-media-query.ts
- caisse-scan.test.ts
- employee-invitation-service.ts
- SettingsPanel
- marketing-topup-route.test.ts
- campaign-lifecycle.ts
- marketing-balance.test.ts
- SponsorWizard
- app/statistiques/page.tsx
- customer-notifications-route.test.ts
- scripts/campaign-worker.ts
- CampagnesPanel
- campaign-audience.ts

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 191 edges
2. `jsonOk()` - 173 edges
3. `requireMutatingRequest()` - 117 edges
4. `prisma` - 110 edges
5. `vitest` - 97 edges
6. `react` - 95 edges
7. `@prisma/client` - 91 edges
8. `clientIp()` - 90 edges
9. `userAgent()` - 86 edges
10. `readJson()` - 83 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `mockLoyaltyContext()` --calls--> `loyaltyUnitForMode()`  [EXTRACTED]
  tests/helpers/loyalty-context-fixtures.ts → src/lib/loyalty-labels.ts
- `configWithWidget()` --calls--> `createDefaultLoyaltyWidgetElement()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/loyalty-widget.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (157 total, 20 thin omitted)

### Community 0 - "insight-period.ts"
Cohesion: 0.20
Nodes (23): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+15 more)

### Community 1 - "card-template-schema.ts"
Cohesion: 0.11
Nodes (18): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CARD_SCHEMA_VERSION, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+10 more)

### Community 2 - "rbac.ts"
Cohesion: 0.19
Nodes (12): CustomerDetailPage(), CustomerDetailPanel(), assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), canViewAllCustomers(), MAX_ACTIVE_EMPLOYEES, staffHasPermission() (+4 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.06
Nodes (55): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+47 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "react"
Cohesion: 0.08
Nodes (27): react, Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), EmployeeInvitationScreen(), ChangePasswordPage(), SPACES (+19 more)

### Community 6 - "loyalty-engine.ts"
Cohesion: 0.14
Nodes (27): assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), block(), buildNextBenefit(), centsToEarnAtLeast() (+19 more)

### Community 7 - "ref_next_navigation"
Cohesion: 0.27
Nodes (18): ref_next_navigation, CampagnesPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), OutilsPage(), MerchantHomePage() (+10 more)

### Community 8 - "fife-life/merchant-detail.tsx"
Cohesion: 0.09
Nodes (21): ref_react_dom_server, AddToGoogleWalletButton(), CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink() (+13 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (35): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+27 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.07
Nodes (49): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel(), summarizeEditorValidation() (+41 more)

### Community 11 - "validation.ts"
Cohesion: 0.06
Nodes (40): GET(), POST(), GET(), POST(), acceptInvitationWithPassword(), findInvitationByToken(), validateInvitationLookup(), createMerchantFullSchema (+32 more)

### Community 12 - "session.ts"
Cohesion: 0.25
Nodes (14): GET(), DELETE(), GET(), parseUserAgent(), isProduction(), resetBrowserAuthState(), cookieOptions(), createSession() (+6 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (66): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+58 more)

### Community 14 - "requireMutatingRequest"
Cohesion: 0.13
Nodes (52): POST(), POST(), POST(), POST(), POST(), POST(), logScanBody(), POST() (+44 more)

### Community 15 - "loyalty-labels.ts"
Cohesion: 0.13
Nodes (23): formatActivityFromTransaction(), getCustomerLoyaltyActivity(), progressLineForTarget(), applyAdjustment(), applyEarnVisit(), applyRedeemReward(), incrementBalanceData(), legacyPointsForUnitBalance() (+15 more)

### Community 16 - "prisma.ts"
Cohesion: 0.11
Nodes (29): zod, POST(), schema, schema, POST(), GET(), POST(), GET() (+21 more)

### Community 17 - "wallet-hydration.test.tsx"
Cohesion: 0.14
Nodes (17): ref_motion_react, react-dom, ref_react_dom_client, ExpandableQrCode(), handleActivate(), openQr(), ExpandableQrCodeProps, InteractiveCardShell() (+9 more)

### Community 18 - "merchant-ui.tsx"
Cohesion: 0.16
Nodes (17): Customer, CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel(), formatActivity() (+9 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.15
Nodes (22): dynamic, GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), runtime, sseChunk(), isDocumentVisible() (+14 more)

### Community 20 - "outils/ui.tsx"
Cohesion: 0.29
Nodes (5): FidelisationPanel(), icons, OutilsPanel(), TOOLS, ToolCard()

### Community 21 - "profile-page.tsx"
Cohesion: 0.08
Nodes (35): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+27 more)

### Community 22 - "cashier-checkout.tsx"
Cohesion: 0.14
Nodes (23): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+15 more)

### Community 23 - "loyaltyBalanceForMode"
Cohesion: 0.15
Nodes (29): main(), dynamic, GET(), CarteIdentitePage(), CarteIndexPage(), dynamic, CardPage(), dynamic (+21 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "env.ts"
Cohesion: 0.07
Nodes (27): ref_next_server, dynamic, dynamic, assertSameOrigin(), CsrfError, env, getAllowedOrigins(), hostMatches() (+19 more)

### Community 26 - "jsonOk"
Cohesion: 0.10
Nodes (33): POST(), POST(), GET(), LOYALTY_MODES, GET(), GET(), GET(), PERIOD_KEYS (+25 more)

### Community 27 - "qr-input.ts"
Cohesion: 0.43
Nodes (5): ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, readManualToken()

### Community 28 - "loyalty-commit.ts"
Cohesion: 0.08
Nodes (45): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), RewardProgressVisualState, appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction() (+37 more)

### Community 29 - "programme/ui.tsx"
Cohesion: 0.08
Nodes (32): DEMO_CONFIG, HistoricalEntitlement, DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep() (+24 more)

### Community 30 - "caisse-client-number.test.ts"
Cohesion: 0.26
Nodes (10): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 31 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 32 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.14
Nodes (31): POST(), POST(), GET(), GET(), serializeCampaign(), GET(), topupSchema, estimateMerchantMembersAudience() (+23 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.11
Nodes (31): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+23 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (26): description, engines, node, name, prisma, seed, private, version (+18 more)

### Community 35 - "[id]/merchant-detail.tsx"
Cohesion: 0.16
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, GoogleWalletMediaCrop(), confirm() (+10 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (31): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+23 more)

### Community 37 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 38 - "demo-session.ts"
Cohesion: 0.10
Nodes (29): ref_next_headers, GET(), GET(), GET(), GET(), GET(), CLIENT_DEMO_COOKIE, EMPLOYEE_DEMO_COOKIE (+21 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+25 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (23): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, MIME_TO_EXT, normalizeGoogleWalletMediaKind() (+15 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-enlarged-view.tsx"
Cohesion: 0.09
Nodes (30): CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard() (+22 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.15
Nodes (8): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR

### Community 45 - "employee-demo-server.ts"
Cohesion: 0.32
Nodes (6): CaisseAliasPage(), EmployeeHomePage(), src_lib_employee_demo_employee_demo_cookie, isEmployeeDemoCookie(), isEmployeeDevDemo(), resolveEmployeeDemo()

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (29): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon(), base (+21 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-event-dedup.ts"
Cohesion: 0.19
Nodes (19): useWalletEvents(), connect(), disconnect(), onVisibility(), canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent() (+11 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.16
Nodes (21): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+13 more)

### Community 50 - "wallet-home.tsx"
Cohesion: 0.12
Nodes (23): CardsSheet(), DiscoverIconLink(), NotificationBellLink(), WalletHome(), ActiveWalletCard, activityFromWalletEvent(), ActivityItem, buildCardNextRewardEntry() (+15 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.08
Nodes (35): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken() (+27 more)

### Community 52 - "playwright"
Cohesion: 0.08
Nodes (14): ref_node_fs_promises, playwright, OUT, OUT, shots, OUT, merchantSlugs, OUT (+6 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.06
Nodes (78): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), dynamic, logCustomerQr() (+70 more)

### Community 55 - "email.ts"
Cohesion: 0.23
Nodes (15): nodemailer, buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml() (+7 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (33): percentChange(), resolvePeriod(), buildCohorts(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments() (+25 more)

### Community 58 - "app/ui.tsx"
Cohesion: 0.22
Nodes (6): HomeStats, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric, TrendBadge()

### Community 59 - "demo-visual.ts"
Cohesion: 0.09
Nodes (22): GET(), EmployeeScanPage(), PREVIEW_PREFERENCES, PREVIEW_PROFILE, requireEmployee(), DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL, DEMO_EMPLOYEE (+14 more)

### Community 60 - "ref_next_link"
Cohesion: 0.13
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "qr-cache.ts"
Cohesion: 0.15
Nodes (19): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_CARDS, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce (+11 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.24
Nodes (14): GET(), GET(), PERIODS, dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformBreakdowns(), getPlatformOverview() (+6 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.12
Nodes (31): GET(), POST(), POST(), POST(), schema, GET(), ensureWalletClassRecord(), parseWalletAction() (+23 more)

### Community 66 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 67 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (35): formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational() (+27 more)

### Community 68 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (12): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+4 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "ref_node_path"
Cohesion: 0.11
Nodes (17): ref_node_fs, ref_node_path, outDir, outDir, outDir, activeCardFromDeck(), CardDeck(), handleCardExpand() (+9 more)

### Community 71 - "merchants-list.tsx"
Cohesion: 0.18
Nodes (12): formatActivity(), MerchantRow, MerchantsListPage(), modeLabel(), pickPreviewTemplate(), statusLabel(), ACTION_DESCRIPTION, ACTION_LABEL (+4 more)

### Community 72 - "@prisma/client"
Cohesion: 0.14
Nodes (10): @prisma/client, LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList() (+2 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 75 - "caisse-scan.ts"
Cohesion: 0.14
Nodes (16): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), CAISSE_GRANT_TTL_MS, logWalletUnlock() (+8 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 79 - "stripe.ts"
Cohesion: 0.23
Nodes (12): isStripeConfigured(), CampaignCheckoutInput, checkoutExpiry(), constructStripeWebhookEvent(), createCampaignCheckoutSession(), createMarketingTopupCheckoutSession(), getStripeClient(), MarketingTopupCheckoutInput (+4 more)

### Community 80 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (18): recharts, AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, ACTIVITY_LABELS, DashboardHome() (+10 more)

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
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 85 - "merchant-card-renderer.tsx"
Cohesion: 0.14
Nodes (31): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+23 more)

### Community 86 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "super-admin-session.ts"
Cohesion: 0.10
Nodes (24): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), SuperAdminCampagnesPage(), SuperAdminCardsPage() (+16 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, BalanceData, CampaignSummary, Channel (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "vitest"
Cohesion: 0.11
Nodes (16): ref_fs, ref_path, vitest, ref_vitest_config, main(), outDir, shot(), outDir (+8 more)

### Community 102 - "merchant-app-access.ts"
Cohesion: 0.23
Nodes (12): CaissePage(), DashboardLayout(), hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess, resolveMerchantAppAccess(), shouldRedirectAppToEmployeeSpace() (+4 more)

### Community 103 - "generate-pwa-icons.mjs"
Cohesion: 0.16
Nodes (12): ref_node_buffer, ref_node_url, ref_node_zlib, outDir, outFile, root, chunk(), color (+4 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.14
Nodes (9): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR (+1 more)

### Community 105 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "jsonError"
Cohesion: 0.07
Nodes (43): GET(), PATCH(), GET(), POST(), GET(), DELETE(), FILTER_MAP, GET() (+35 more)

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
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.14
Nodes (18): EmployeeLoginPage(), EmployeeLoginScreen(), onSubmit(), readApiJson(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName() (+10 more)

### Community 120 - "cn"
Cohesion: 0.15
Nodes (13): DashboardLayout(), CreateMerchantWizard(), goNext(), stepError(), AppNav(), icons, isActive(), TOOLS_PREFIXES (+5 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.14
Nodes (11): adRequestFindFirst, adRequestUpdate, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage, paymentUpsert (+3 more)

### Community 122 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (16): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+8 more)

### Community 124 - "resolvePublishedMerchantCardTemplate"
Cohesion: 0.16
Nodes (14): GET(), dynamic, MerchantProfilePage(), JoinMerchantPage(), getPublishedCardTemplate(), logMerchantCardSwitch(), MerchantCardSwitchContext, MerchantCardSwitchStep (+6 more)

### Community 125 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 126 - "[kind]/route.ts"
Cohesion: 0.67
Nodes (3): GET(), notFound(), loadRoute()

### Community 127 - "merchant-card-finish.test.ts"
Cohesion: 0.16
Nodes (15): ref_os, BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr() (+7 more)

### Community 128 - "webhook/route.ts"
Cohesion: 0.29
Nodes (11): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST() (+3 more)

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "discover-page.tsx"
Cohesion: 0.27
Nodes (5): DiscoverPage(), Merchant, Sponsored, SponsoredAd, SponsoredBanner()

### Community 131 - "cards-index.tsx"
Cohesion: 0.29
Nodes (9): ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate(), statusLabel() (+1 more)

### Community 132 - "customer-push-route.test.ts"
Cohesion: 0.33
Nodes (4): pushSubscriptionDeleteMany, pushSubscriptionUpsert, requireMutatingRequest, requireUser

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "media-storage-guard.ts"
Cohesion: 0.83
Nodes (3): deleteCardBackground(), deleteCardBackgroundIfUnused(), isCardBackgroundInUse()

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 141 - "resolveLandingAuthTargets"
Cohesion: 0.40
Nodes (3): HomePage(), resolveLandingAuthTargets(), { getSessionUserMock, getEmployeeSessionMock }

### Community 142 - "loyalty-reward-removal.ts"
Cohesion: 0.47
Nodes (4): decideRewardRemoval(), LoyaltyRewardDraft, RewardRemovalDecision, updateDraftRewardsForRemoval()

### Community 143 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 144 - "requireMerchantAdmin"
Cohesion: 0.12
Nodes (30): GET(), DELETE(), GET(), loadOwnedCampaign(), PATCH(), GET(), sortOrder(), POST() (+22 more)

### Community 146 - "CampaignWizard"
Cohesion: 0.20
Nodes (8): audienceDisplay(), CampaignWizard(), formatCents(), formatDate(), ledgerLabel(), MarketingBalanceCard(), topup(), startTopup()

### Community 149 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 150 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (16): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+8 more)

### Community 152 - "marketing-topup-route.test.ts"
Cohesion: 0.22
Nodes (7): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 153 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 155 - "marketing-balance.test.ts"
Cohesion: 0.36
Nodes (6): Entry, makeTx(), snapshot(), state, transaction(), uniqueViolation()

### Community 156 - "SponsorWizard"
Cohesion: 0.29
Nodes (5): addDaysToDateInput(), estimateSponsorPrice(), nowTimeInputValue(), SponsorWizard(), todayDateInputValue()

### Community 158 - "app/statistiques/page.tsx"
Cohesion: 0.18
Nodes (7): heatmap, INSIGHT_DEMO_RESPONSE, StatistiquesPage(), admin, cashier, grantedCashier, manager

### Community 159 - "customer-notifications-route.test.ts"
Cohesion: 0.33
Nodes (5): inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser

### Community 160 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 164 - "campaign-audience.ts"
Cohesion: 0.28
Nodes (6): AudienceEstimate, estimatedForChannel(), estimateNetworkLocalAudience(), networkAudienceWhere(), customerMembershipFindMany, customerPreferencesFindMany

## Knowledge Gaps
- **809 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+804 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1084 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `insight-period.ts`, `lib/campaign-worker.ts`, `rbac.ts`, `merchant-card-template-service.ts`, `customer-push-route.test.ts`, `react`, `loyalty-engine.ts`, `super-admin-campaign-moderation.test.ts`, `campaign-crud-routes.test.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `push-client.ts`, `qr-input.ts`, `card-editor-properties.tsx`, `resolveLandingAuthTargets`, `loyalty-labels.ts`, `prisma.ts`, `wallet-hydration.test.tsx`, `loyalty-reward-removal.ts`, `use-wallet-unlock-animation.ts`, `caisse-scan.test.ts`, `employee-invitation-service.ts`, `cashier-checkout.tsx`, `google-auth.ts`, `campaign-lifecycle.ts`, `env.ts`, `marketing-balance.test.ts`, `loyalty-commit.ts`, `marketing-topup-route.test.ts`, `caisse-client-number.test.ts`, `customer-notifications-route.test.ts`, `campaigns/[id]/confirm/route.ts`, `app/statistiques/page.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `campaign-audience.ts`, `api-merchant-statistics-route.test.ts`, `demo-session.ts`, `statistiques-panel.tsx`, `scan/ui.tsx`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-widget-view.tsx`, `loyalty-program-publication.ts`, `wallet-home.tsx`, `qa-login.ts`, `google-wallet.ts`, `email.ts`, `insight-stats.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `loyalty-program.ts`, `stripe-webhook-marketing.test.ts`, `stripe-webhook-route.test.ts`, `ref_node_path`, `caisse-scan.ts`, `unsubscribe-token.ts`, `stripe.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `customer-preferences-route.test.ts`, `merchant-app-access.ts`, `src/app/layout.tsx`, `campaign-worker.test.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `resolvePublishedMerchantCardTemplate`, `landing-page.test.ts`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `lib/campaign-worker.ts`, `rbac.ts`, `cards-index.tsx`, `merchant-card-template-service.ts`, `loyalty-engine.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget.ts`, `validation.ts`, `session.ts`, `card-editor-properties.tsx`, `loyalty-reward-removal.ts`, `loyalty-labels.ts`, `prisma.ts`, `requireMerchantAdmin`, `use-wallet-unlock-animation.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `employee-invitation-service.ts`, `google-auth.ts`, `campaign-lifecycle.ts`, `jsonOk`, `loyalty-commit.ts`, `programme/ui.tsx`, `create-super-admin.ts`, `campaigns/[id]/confirm/route.ts`, `card-editor.tsx`, `package.json`, `campaign-audience.ts`, `loyalty-program-publication.ts`, `wallet-home.tsx`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `demo-visual.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `loyalty-program.ts`, `qr.ts`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `merchant-app-access.ts`, `jsonError`, `employee-session.ts`, `resolvePublishedMerchantCardTemplate`, `merchant-card-finish.test.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `card-template-schema.ts`, `discover-page.tsx`, `cards-index.tsx`, `merchant-card-template-service.ts`, `fife-life/merchant-detail.tsx`, `loyalty-widget-view.tsx`, `card-editor-properties.tsx`, `wallet-hydration.test.tsx`, `merchant-ui.tsx`, `use-wallet-unlock-animation.ts`, `use-media-query.ts`, `profile-page.tsx`, `cashier-checkout.tsx`, `programme/ui.tsx`, `card-editor.tsx`, `package.json`, `[id]/merchant-detail.tsx`, `statistiques-panel.tsx`, `scan/ui.tsx`, `card-enlarged-view.tsx`, `src/app/page.tsx`, `wallet-event-dedup.ts`, `wallet-home.tsx`, `qa-login.ts`, `app/ui.tsx`, `ref_next_link`, `qr-cache.ts`, `loyalty-program.ts`, `ref_node_path`, `merchants-list.tsx`, `@prisma/client`, `layout-shell.tsx`, `merchant-card-renderer.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`, `notifications-center.tsx`, `cn`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _809 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card-template-schema.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10952380952380952 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06490384615384616 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08196721311475409 - nodes in this community are weakly interconnected._