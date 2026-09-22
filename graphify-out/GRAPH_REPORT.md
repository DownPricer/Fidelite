# Graph Report - Cartefidelité  (2026-09-22)

## Corpus Check
- 585 files · ~4,720,707 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 6, .example 3, .css 3)

## Summary
- 3077 nodes · 9562 edges · 159 communities (136 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `73900b75`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- jsonOk
- ref_node_fs_promises
- scan/ui.tsx
- merchant-card-template-service.ts
- next
- components/ui.tsx
- rbac.ts
- merchant-ui.tsx
- wallet-event-dedup.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- requireMutatingRequest
- interactive-loyalty-card.tsx
- card-editor-properties.tsx
- clientIp
- vitest
- super-admin/auth/login/route.ts
- card-enlarged-view.tsx
- cn
- use-wallet-unlock-animation.ts
- super-admin.test.ts
- api-guard.ts
- loyalty-commit.ts
- merchant-app-access.ts
- google-auth.ts
- middleware.ts
- jsonError
- profile-page.tsx
- loyalty-program.ts
- types.ts
- cashier-checkout.tsx
- ProgramConfigurator
- campaign-quota.ts
- CardEditorPage
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- buildGoogleWalletMerchantView
- demo-session.ts
- What You Must Do When Invoked
- loyalty-labels.ts
- media-storage.ts
- loyalty-commit.test.ts
- card-deck.tsx
- ref_fs_promises
- ref_next_navigation
- src/app/page.tsx
- compilerOptions
- wallet-home.tsx
- loyalty-program-publication.ts
- qr-cache.ts
- qa-login.ts
- caisse-client-number.test.ts
- dependencies
- google-wallet.ts
- email.ts
- devDependencies
- insight-stats.ts
- caisse-scan.test.ts
- caisse-scan.ts
- ref_next_link
- loyalty-service.test.ts
- scripts
- webhook/route.ts
- platform-stats.ts
- google-wallet/route.ts
- programme/ui.tsx
- session.ts
- campaigns/[id]/confirm/route.ts
- stripe-webhook-route.test.ts
- generate-pwa-icons.mjs
- [id]/merchant-detail.tsx
- merchant-card-renderer.tsx
- card-template-schema.ts
- accept-invitation/route.ts
- customer-loyalty-overview.ts
- unsubscribe-token.ts
- EmployeeDetailPanel
- insight-charts.tsx
- caisse-scan-route.test.ts
- landing-merchant-preview.tsx
- cartes.js
- Fidelo
- docker-entrypoint.sh
- create-super-admin.ts
- MerchantDetailPage
- fife-life/merchant-detail.tsx
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
- api-merchant-statistics-route.test.ts
- ref_path
- scan/route.ts
- src/app/layout.tsx
- landing-header.tsx
- graphify reference: query, path, explain
- campaign-worker.test.ts
- employee-invitation-service.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- getSessionUser
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- employee-session.ts
- insight-definitions.ts
- CreateMerchantWizard
- verify-viewports.mjs
- EmployeeLoginScreen
- campaign-confirm-route.test.ts
- [kind]/route.ts
- qr.ts
- qr/route.ts
- playwright
- card-editor.tsx
- lib/campaign-worker.ts
- react
- ref_node_path
- landing-page.test.ts
- super-admin-campaign-moderation.test.ts
- push.ts
- layout-shell.tsx
- campaign-crud-routes.test.ts
- ref_next_server
- demo-visual.ts
- push-client.ts
- google-wallet-doctor.ts
- qa-login/page.tsx
- campaign-lifecycle.ts
- app/ui.tsx
- fmtNum
- theme-provider.tsx
- campaign-quota.test.ts
- GET
- generate-google-wallet-logo.mjs
- scripts/campaign-worker.ts
- env.ts
- loyalty-cards-capture.mjs
- invitation/page.tsx
- insight-permissions.test.ts
- employee-app-capture.mjs
- merchant-search-v1.mjs
- wallet-desktop-capture.mjs
- campaign-audience.test.ts
- wallet-carousel-v5.mjs

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 188 edges
2. `jsonOk()` - 170 edges
3. `requireMutatingRequest()` - 115 edges
4. `prisma` - 107 edges
5. `react` - 93 edges
6. `vitest` - 91 edges
7. `@prisma/client` - 88 edges
8. `clientIp()` - 88 edges
9. `userAgent()` - 84 edges
10. `readJson()` - 81 edges

## Surprising Connections (you probably didn't know these)
- `loop()` --calls--> `runWorkerTick()`  [EXTRACTED]
  scripts/campaign-worker.ts → src/lib/campaign-worker.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `main()` --calls--> `googleWalletLogoUrl()`  [EXTRACTED]
  scripts/google-wallet-doctor.ts → src/lib/google-wallet.ts
- `legacyHeavyConfig()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/card-editor-legacy-reset.test.ts → src/lib/card-template-schema.ts
- `configWithWidget()` --calls--> `defaultCardTemplateConfig()`  [EXTRACTED]
  tests/loyalty-widget.test.tsx → src/lib/card-template-schema.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (159 total, 23 thin omitted)

### Community 0 - "jsonOk"
Cohesion: 0.07
Nodes (41): zod, GET(), DELETE(), GET(), GET(), dynamic, GET(), dynamic (+33 more)

### Community 1 - "ref_node_fs_promises"
Cohesion: 0.20
Nodes (4): ref_node_fs_promises, OUT, OUT, OUT

### Community 2 - "scan/ui.tsx"
Cohesion: 0.13
Nodes (33): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+25 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.05
Nodes (71): GET(), GET(), JoinMerchantPage(), ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow (+63 more)

### Community 4 - "next"
Cohesion: 0.17
Nodes (5): nextConfig, next, metadata, viewport, metadata

### Community 5 - "components/ui.tsx"
Cohesion: 0.09
Nodes (24): Merchant, MerchantPublic(), CustomerLoginForm(), googleMessage(), ChangePasswordPage(), LOYALTY_MODES, STEPS, SuperAdminLoginPage() (+16 more)

### Community 6 - "rbac.ts"
Cohesion: 0.11
Nodes (18): assertCanAddEmployee(), canAddEmployee(), canAdjustPoints(), MAX_ACTIVE_EMPLOYEES, staffHasPermission(), StaffMembership, ADMIN_PERMISSIONS, CASHIER_DEFAULT (+10 more)

### Community 7 - "merchant-ui.tsx"
Cohesion: 0.12
Nodes (25): CampagnesPage(), CustomerDetailPage(), ClientsPage(), EmployeeDetailPage(), EmployeesPage(), FidelisationPage(), FidelisationPanel(), OutilsPage() (+17 more)

### Community 8 - "wallet-event-dedup.ts"
Cohesion: 0.26
Nodes (14): canUseSessionStorage(), getStoredLastEventId(), hasAnimatedCard(), hasSeenWalletEvent(), markCardAnimated(), markWalletEventSeen(), memoryAnimatedCards, memoryLastEventId (+6 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.07
Nodes (34): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetView(), pct(), ProgressCircle() (+26 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.09
Nodes (43): buildElementCatalog(), LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+35 more)

### Community 11 - "requireMutatingRequest"
Cohesion: 0.09
Nodes (49): POST(), POST(), POST(), POST(), POST(), POST(), PATCH(), DELETE() (+41 more)

### Community 12 - "interactive-loyalty-card.tsx"
Cohesion: 0.10
Nodes (27): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps, LADDER, resolveTier() (+19 more)

### Community 13 - "card-editor-properties.tsx"
Cohesion: 0.07
Nodes (66): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+58 more)

### Community 14 - "clientIp"
Cohesion: 0.16
Nodes (31): POST(), POST(), POST(), POST(), POST(), PATCH(), POST(), POST() (+23 more)

### Community 15 - "vitest"
Cohesion: 0.13
Nodes (24): @prisma/client, vitest, ActiveMerchantLoyaltyContext, getActiveMerchantLoyaltyContextBySlug(), isMerchantOperational(), isProgramOperational(), logContext(), progressTargetForBalance() (+16 more)

### Community 16 - "super-admin/auth/login/route.ts"
Cohesion: 0.11
Nodes (28): POST(), schema, GET(), POST(), POST(), POST(), schema, GET() (+20 more)

### Community 17 - "card-enlarged-view.tsx"
Cohesion: 0.13
Nodes (20): ref_motion_react, react-dom, ref_react_dom_client, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), ExpandableQrCode() (+12 more)

### Community 18 - "cn"
Cohesion: 0.09
Nodes (29): Customer, CustomerDetailPanel(), CustomersPanel(), DEMO, formatActivity(), DEMO, Employee, EmployeesPanel() (+21 more)

### Community 19 - "use-wallet-unlock-animation.ts"
Cohesion: 0.17
Nodes (19): ref_node_fs, isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible(), hasRenderReadyTemplate(), cardFromUnlockPayload(), fetchUnlockCardDetail() (+11 more)

### Community 20 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 21 - "api-guard.ts"
Cohesion: 0.10
Nodes (22): FILTER_MAP, schema, dynamic, dynamic, runtime, sseChunk(), GET(), LOYALTY_MODES (+14 more)

### Community 22 - "loyalty-commit.ts"
Cohesion: 0.10
Nodes (40): buildTargetView(), getCustomerMerchantRewardProgress(), resolveVisualState(), appliedTierLabel(), assembleView(), buildView(), commitLoyaltyTransaction(), customerName() (+32 more)

### Community 23 - "merchant-app-access.ts"
Cohesion: 0.21
Nodes (14): CaissePage(), DashboardLayout(), MerchantHomePage(), DEMO_MERCHANT, hasMerchantStaffAccess(), isMerchantAppPublicPath(), MERCHANT_APP_PUBLIC_PATHS, MerchantAppAccess (+6 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.12
Nodes (28): GET(), GET(), AppLoginPage(), CustomerLoginPage(), isGoogleAuthConfigured(), consumeGoogleCallback(), createGoogleAuthUrl(), decodeStateCookie() (+20 more)

### Community 25 - "middleware.ts"
Cohesion: 0.13
Nodes (19): hostnameOf(), isAdminHost(), isAppHost(), isCustomerHost(), isEmployeeHost(), isLocalHost(), assertSuperAdminProductionConfig(), hasSuperAdminEntryCookie() (+11 more)

### Community 26 - "jsonError"
Cohesion: 0.09
Nodes (44): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), POST() (+36 more)

### Community 27 - "profile-page.tsx"
Cohesion: 0.07
Nodes (47): GET(), AccountPage(), ParametresPage(), PREVIEW_BENEFITS, PREVIEW_PROFILE_HISTORY, AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl() (+39 more)

### Community 28 - "loyalty-program.ts"
Cohesion: 0.10
Nodes (33): block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, EarnHistory, evaluateEarn(), formatDurationMinutes(), LoyaltyAction (+25 more)

### Community 29 - "types.ts"
Cohesion: 0.18
Nodes (7): LinearGauge(), MerchantCardPublicPreview(), MerchantFace(), MerchantRoulette(), MerchantCardData, PublicMerchant, WalletCardsList()

### Community 30 - "cashier-checkout.tsx"
Cohesion: 0.14
Nodes (24): AmountField(), press(), KEYS, CashierCheckout(), askRedeem(), commitEarn(), confirmRedeem(), Phase (+16 more)

### Community 31 - "ProgramConfigurator"
Cohesion: 0.19
Nodes (21): modeTitle(), ProgramConfigurator(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward() (+13 more)

### Community 32 - "campaign-quota.ts"
Cohesion: 0.22
Nodes (12): consumeQuotaForCampaign(), priceMemberOrNetworkCampaign(), priceSponsoredAd(), PricingResult, quotaKindFor(), CAMPAIGN_PRICE_CENTS, INCLUDED_QUOTAS, isNetworkQuotaKind() (+4 more)

### Community 33 - "CardEditorPage"
Cohesion: 0.10
Nodes (33): CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction(), saveDraft() (+25 more)

### Community 34 - "package.json"
Cohesion: 0.07
Nodes (27): description, engines, node, name, prisma, seed, private, version (+19 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.24
Nodes (12): GoogleWalletMediaCrop(), confirm(), onPointerMove(), patchState(), centeredCropState(), clampCropState(), computeCoverCrop(), CropState (+4 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.13
Nodes (15): ApiResponse, COMPARISON_METRICS, FinancesTab(), LockedPlaceholder, MAX_COMPARISON_METRICS, MIN_COMPARISON_METRICS, normalizeBase100(), OverviewTab() (+7 more)

### Community 37 - "buildGoogleWalletMerchantView"
Cohesion: 0.25
Nodes (18): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), googleWalletLogoUrl() (+10 more)

### Community 38 - "demo-session.ts"
Cohesion: 0.16
Nodes (16): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), applyDemoRoleCookies() (+8 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "loyalty-labels.ts"
Cohesion: 0.15
Nodes (27): assertEarnProgramRules(), buildProgramSnapshot(), buildProgramSnapshotFromContext(), CaisseProgramSnapshot, publicScanPayload(), applyAdjustment(), applyEarnVisit(), applyRedeemReward() (+19 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.15
Nodes (24): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig, deleteCardBackgroundIfUnused() (+16 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "card-deck.tsx"
Cohesion: 0.20
Nodes (13): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+5 more)

### Community 44 - "ref_fs_promises"
Cohesion: 0.12
Nodes (13): ref_fs_promises, ref_sharp, OUT, shots, OUT, tiers, files, INPUT_DIR (+5 more)

### Community 45 - "ref_next_navigation"
Cohesion: 0.13
Nodes (19): ref_next_headers, ref_next_navigation, CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie() (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.09
Nodes (30): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+22 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "wallet-home.tsx"
Cohesion: 0.11
Nodes (20): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, usePersonalizedQr(), useWalletEvents(), connect(), disconnect() (+12 more)

### Community 49 - "loyalty-program-publication.ts"
Cohesion: 0.15
Nodes (20): activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards(), createAcquiredRewardEntitlements(), LoyaltyDraftReward, LoyaltyProgramDraft, MAX_CONFIGURED_REWARDS, ModeChangeDecision (+12 more)

### Community 50 - "qr-cache.ts"
Cohesion: 0.17
Nodes (17): MerchantInteractiveCard(), MerchantInteractiveCardProps, PREVIEW_QR, QrBlock(), cache, cacheKey(), failedOnce, fetchCustomerQr() (+9 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.10
Nodes (30): ref_crypto, assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken() (+22 more)

### Community 52 - "caisse-client-number.test.ts"
Cohesion: 0.26
Nodes (10): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 53 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+11 more)

### Community 54 - "google-wallet.ts"
Cohesion: 0.16
Nodes (32): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), ensureGlobalClassRecord() (+24 more)

### Community 55 - "email.ts"
Cohesion: 0.25
Nodes (14): buildCampaignEmailContent(), buildInvitationContent(), CampaignEmailInput, emailConfigHint(), EmailSendResult, EmployeeInvitationEmailInput, escapeHtml(), formatExpiry() (+6 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.08
Nodes (56): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+48 more)

### Community 58 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 59 - "caisse-scan.ts"
Cohesion: 0.25
Nodes (10): buildScanResult(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber(), CAISSE_GRANT_TTL_MS, logWalletUnlock() (+2 more)

### Community 60 - "ref_next_link"
Cohesion: 0.13
Nodes (9): ref_next_link, SPACES, COLUMNS, isInternalPath(), LandingFooter(), MerchantCardsGallery(), slotStatusLabel(), slotTone() (+1 more)

### Community 61 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 62 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, icons (+6 more)

### Community 63 - "webhook/route.ts"
Cohesion: 0.21
Nodes (15): stripe, handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), POST(), refundIncludedQuota() (+7 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.30
Nodes (11): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), PeriodKey (+3 more)

### Community 65 - "google-wallet/route.ts"
Cohesion: 0.15
Nodes (22): ensureWalletClassRecord(), parseWalletAction(), POST(), publishedMediaExists(), schema, validateAppearanceColor(), contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS (+14 more)

### Community 66 - "programme/ui.tsx"
Cohesion: 0.13
Nodes (18): DEMO_CONFIG, HistoricalEntitlement, MODES, PROGRAM_STEP_TARGETS, PROGRAM_STEPS, emptyReward(), FieldErrors, previewLine() (+10 more)

### Community 67 - "session.ts"
Cohesion: 0.15
Nodes (17): POST(), GET(), POST(), DELETE(), POST(), AVATAR_DIR, deleteAvatarFiles(), MIME_TO_EXT (+9 more)

### Community 68 - "campaigns/[id]/confirm/route.ts"
Cohesion: 0.38
Nodes (12): POST(), GET(), GET(), AudienceEstimate, estimatedForChannel(), estimateMerchantMembersAudience(), estimateNetworkLocalAudience(), planAndRemainingQuota() (+4 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.15
Nodes (10): campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, FakeStripeNotConfiguredError, refundIncludedQuota (+2 more)

### Community 70 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 71 - "[id]/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): MEDIA_TO_APPEARANCE_KEY, RECOMMENDED_WALLET_COLORS, WalletAppearance, WalletMediaKey, WalletMediaPreview, WalletPreviewView, formatActivity(), MerchantRow (+10 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.15
Nodes (25): COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer(), MerchantCardRendererProps, resolveDisplayQrSrc() (+17 more)

### Community 73 - "card-template-schema.ts"
Cohesion: 0.09
Nodes (20): CardTemplateBackground(), CardEditorBackgroundCrop(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND, CardDecorativeStyle, cardElementSchema, CardLogoStyle (+12 more)

### Community 74 - "accept-invitation/route.ts"
Cohesion: 0.15
Nodes (19): POST(), schema, GET(), POST(), GET(), POST(), POST(), acceptInvitationWithPassword() (+11 more)

### Community 75 - "customer-loyalty-overview.ts"
Cohesion: 0.10
Nodes (36): main(), dynamic, GET(), CarteIndexPage(), dynamic, CardPage(), dynamic, activityFromWalletEvent() (+28 more)

### Community 76 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 77 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 78 - "insight-charts.tsx"
Cohesion: 0.25
Nodes (10): InsightBarChart(), InsightCard(), InsightDonutChart(), InsightHeatmap(), InsightLineChart(), InsightMultiLineChart(), KpiCard(), PALETTE (+2 more)

### Community 79 - "caisse-scan-route.test.ts"
Cohesion: 0.25
Nodes (6): processCaisseScan, processCaisseScanByClientNumber, rateLimit, requireCaisse, requireMutatingRequest, writeAudit

### Community 80 - "landing-merchant-preview.tsx"
Cohesion: 0.50
Nodes (3): BARS, LandingMerchantPreview(), STATS

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fidelo"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fidelo, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 85 - "MerchantDetailPage"
Cohesion: 0.21
Nodes (6): MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), revokeWalletPreviews()

### Community 86 - "fife-life/merchant-detail.tsx"
Cohesion: 0.12
Nodes (18): ref_react_dom_server, CustomerProgramView, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel(), notifyMerchantRewardProgressRefresh(), TargetBlock() (+10 more)

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
Cohesion: 0.09
Nodes (18): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampagnesPanel(), CampaignSummary, CampaignWizard() (+10 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "api-merchant-statistics-route.test.ts"
Cohesion: 0.20
Nodes (8): findUniqueSubscription, FREE_STATS, getFreeMerchantStats, getInsightPremium, getLockedInsightPlaceholder, REAL_PLACEHOLDER, REAL_PREMIUM, requireMerchantStatsAccess

### Community 102 - "ref_path"
Cohesion: 0.11
Nodes (14): ref_fs, ref_path, ref_vitest_config, main(), outDir, shot(), outDir, main() (+6 more)

### Community 103 - "scan/route.ts"
Cohesion: 0.29
Nodes (9): logScanBody(), POST(), scanVia(), ALLOWED_QR_HOSTS, extractFifeLifeQrToken(), extractJwtFromText(), QrInputError, publicQrErrorMessage() (+1 more)

### Community 104 - "src/app/layout.tsx"
Cohesion: 0.22
Nodes (7): ref_next_font_google, src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister()

### Community 105 - "landing-header.tsx"
Cohesion: 0.29
Nodes (6): next-themes, MoonIcon(), SunIcon(), LandingHeader(), NAV_LINKS, ThemeToggle()

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (16): rows(), baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany (+8 more)

### Community 108 - "employee-invitation-service.ts"
Cohesion: 0.22
Nodes (14): buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR, invitationExpiryDate(), isInvitationExpired(), createMembershipInvitation() (+6 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "getSessionUser"
Cohesion: 0.22
Nodes (9): dynamic, NotificationsPage(), ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), getSessionUser() (+1 more)

### Community 118 - "employee-session.ts"
Cohesion: 0.17
Nodes (15): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+7 more)

### Community 120 - "CreateMerchantWizard"
Cohesion: 0.50
Nodes (3): CreateMerchantWizard(), goNext(), stepError()

### Community 122 - "EmployeeLoginScreen"
Cohesion: 0.40
Nodes (3): EmployeeLoginScreen(), onSubmit(), readApiJson()

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.13
Nodes (15): baseCampaign, campaignFindFirst, campaignPaymentCreate, campaignUpdate, createCampaignCheckoutSession, estimateMerchantMembersAudience, estimateNetworkLocalAudience, FakeStripeNotConfiguredError (+7 more)

### Community 124 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (6): ref_os, GET(), notFound(), config(), loadRoute(), PNG_BYTES

### Community 125 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 126 - "qr/route.ts"
Cohesion: 0.16
Nodes (17): dynamic, logCustomerQr(), POST(), runtime, schema, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl() (+9 more)

### Community 127 - "playwright"
Cohesion: 0.20
Nodes (4): playwright, outDir, outDir, OUT

### Community 128 - "card-editor.tsx"
Cohesion: 0.22
Nodes (7): PreviewScenario, PROGRESS_STEPS, SCENARIO_LABELS, Action, HistoryState, useEditorHistory(), CARD_SLOT_TITLES

### Community 129 - "lib/campaign-worker.ts"
Cohesion: 0.26
Nodes (12): backoffMinutesForAttempt(), claimNextScheduledCampaign(), deliveryChannelsFor(), finalizeCampaignIfComplete(), materializeDeliveries(), processPendingDeliveries(), runWorkerTick(), sendOneDelivery() (+4 more)

### Community 130 - "react"
Cohesion: 0.13
Nodes (14): react, DiscoverPage(), Merchant, Sponsored, DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind (+6 more)

### Community 131 - "ref_node_path"
Cohesion: 0.25
Nodes (3): ref_node_path, outDir, OUT

### Community 132 - "landing-page.test.ts"
Cohesion: 0.18
Nodes (9): authTargets, connexionUi, faq, footer, header, heroVisual, page, proPage (+1 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.20
Nodes (8): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin, writeAudit

### Community 134 - "push.ts"
Cohesion: 0.31
Nodes (7): web-push, isWebPushConfigured(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), WebPushNotConfiguredError

### Community 135 - "layout-shell.tsx"
Cohesion: 0.09
Nodes (18): recharts, AdRequest, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget, ACTIVITY_LABELS, DashboardHome() (+10 more)

### Community 136 - "campaign-crud-routes.test.ts"
Cohesion: 0.22
Nodes (7): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 137 - "ref_next_server"
Cohesion: 0.08
Nodes (17): ref_next_server, inAppNotificationCount, inAppNotificationFindMany, inAppNotificationUpdateMany, requireMutatingRequest, requireUser, basePrefs, consentEventCreateMany (+9 more)

### Community 138 - "demo-visual.ts"
Cohesion: 0.11
Nodes (18): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, CustomerLoyaltyOverview, DEMO_LOYALTY_OVERVIEW, CLIENT_DEMO_COOKIE, src_lib_demo_visual_client_demo_cookie (+10 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "google-wallet-doctor.ts"
Cohesion: 0.52
Nodes (6): google-auth-library, accessToken(), fail(), main(), ok(), pngSize()

### Community 141 - "qa-login/page.tsx"
Cohesion: 0.36
Nodes (5): dynamic, QaLoginPage(), QaLoginClient(), readFragmentToken(), isQaMagicLoginEnabled()

### Community 142 - "campaign-lifecycle.ts"
Cohesion: 0.50
Nodes (6): isCancellable(), isDuplicable(), requiresModeration(), statusAfterFundingConfirmed(), statusAfterModerationApproved(), statusAfterModerationRejected()

### Community 143 - "app/ui.tsx"
Cohesion: 0.22
Nodes (6): HomeStats, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric, TrendBadge()

### Community 144 - "fmtNum"
Cohesion: 0.33
Nodes (6): FideliteTab(), fmtDays(), fmtNum(), FrequentationTab(), RecompensesTab(), StatistiquesPanel()

### Community 146 - "campaign-quota.test.ts"
Cohesion: 0.47
Nodes (5): campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique

### Community 147 - "GET"
Cohesion: 0.53
Nodes (5): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), shouldSendSseEvent()

### Community 148 - "generate-google-wallet-logo.mjs"
Cohesion: 0.40
Nodes (4): ref_node_url, outDir, outFile, root

### Community 149 - "scripts/campaign-worker.ts"
Cohesion: 0.70
Nodes (4): log(), loop(), requestShutdown(), sleep()

### Community 150 - "env.ts"
Cohesion: 0.19
Nodes (7): assertSameOrigin(), CsrfError, employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), env, getAllowedOrigins()

### Community 151 - "loyalty-cards-capture.mjs"
Cohesion: 0.40
Nodes (3): goto(), OUT, tiers

### Community 153 - "insight-permissions.test.ts"
Cohesion: 0.40
Nodes (4): admin, cashier, grantedCashier, manager

## Knowledge Gaps
- **752 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+747 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1002 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `lib/campaign-worker.ts`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `landing-page.test.ts`, `components/ui.tsx`, `rbac.ts`, `ref_node_path`, `campaign-crud-routes.test.ts`, `ref_next_server`, `loyalty-widget.ts`, `push-client.ts`, `super-admin-campaign-moderation.test.ts`, `card-editor-properties.tsx`, `campaign-lifecycle.ts`, `loyalty-widget-view.tsx`, `card-enlarged-view.tsx`, `campaign-quota.test.ts`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `api-guard.ts`, `loyalty-commit.ts`, `merchant-app-access.ts`, `google-auth.ts`, `middleware.ts`, `insight-permissions.test.ts`, `loyalty-program.ts`, `campaign-audience.test.ts`, `cashier-checkout.tsx`, `campaign-quota.ts`, `CardEditorPage`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `demo-session.ts`, `loyalty-labels.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `loyalty-program-publication.ts`, `qa-login.ts`, `caisse-client-number.test.ts`, `email.ts`, `insight-stats.ts`, `caisse-scan.test.ts`, `loyalty-service.test.ts`, `platform-stats.ts`, `google-wallet/route.ts`, `stripe-webhook-route.test.ts`, `merchant-card-renderer.tsx`, `accept-invitation/route.ts`, `customer-loyalty-overview.ts`, `unsubscribe-token.ts`, `caisse-scan-route.test.ts`, `fife-life/merchant-detail.tsx`, `theme-provider.tsx`, `api-merchant-statistics-route.test.ts`, `ref_path`, `scan/route.ts`, `campaign-worker.test.ts`, `employee-invitation-service.ts`, `getSessionUser`, `campaign-confirm-route.test.ts`, `[kind]/route.ts`, `qr.ts`, `qr/route.ts`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `vitest` to `card-editor.tsx`, `lib/campaign-worker.ts`, `jsonOk`, `merchant-card-template-service.ts`, `rbac.ts`, `loyalty-widget.ts`, `requireMutatingRequest`, `card-editor-properties.tsx`, `clientIp`, `campaign-lifecycle.ts`, `super-admin/auth/login/route.ts`, `use-wallet-unlock-animation.ts`, `super-admin.test.ts`, `api-guard.ts`, `loyalty-commit.ts`, `merchant-app-access.ts`, `google-auth.ts`, `jsonError`, `profile-page.tsx`, `loyalty-program.ts`, `types.ts`, `cashier-checkout.tsx`, `campaign-quota.ts`, `CardEditorPage`, `package.json`, `loyalty-labels.ts`, `wallet-home.tsx`, `loyalty-program-publication.ts`, `qa-login.ts`, `google-wallet.ts`, `insight-stats.ts`, `ref_next_link`, `loyalty-service.test.ts`, `platform-stats.ts`, `programme/ui.tsx`, `session.ts`, `campaigns/[id]/confirm/route.ts`, `merchant-card-renderer.tsx`, `card-template-schema.ts`, `accept-invitation/route.ts`, `customer-loyalty-overview.ts`, `create-super-admin.ts`, `fife-life/merchant-detail.tsx`, `super-admin-session.ts`, `employee-invitation-service.ts`, `employee-session.ts`, `qr.ts`, `qr/route.ts`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `card-editor.tsx`, `scan/ui.tsx`, `merchant-card-template-service.ts`, `components/ui.tsx`, `layout-shell.tsx`, `merchant-ui.tsx`, `loyalty-widget-view.tsx`, `interactive-loyalty-card.tsx`, `qa-login/page.tsx`, `card-editor-properties.tsx`, `app/ui.tsx`, `card-enlarged-view.tsx`, `cn`, `use-wallet-unlock-animation.ts`, `theme-provider.tsx`, `invitation/page.tsx`, `profile-page.tsx`, `types.ts`, `cashier-checkout.tsx`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `card-deck.tsx`, `src/app/page.tsx`, `wallet-home.tsx`, `qr-cache.ts`, `ref_next_link`, `programme/ui.tsx`, `[id]/merchant-detail.tsx`, `merchant-card-renderer.tsx`, `card-template-schema.ts`, `insight-charts.tsx`, `fife-life/merchant-detail.tsx`, `super-admin-session.ts`, `campagnes/ui.tsx`, `src/app/layout.tsx`, `landing-header.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _752 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `jsonOk` be split into smaller, more focused modules?**
  _Cohesion score 0.06823529411764706 - nodes in this community are weakly interconnected._
- **Should `scan/ui.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13008130081300814 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05070028011204482 - nodes in this community are weakly interconnected._