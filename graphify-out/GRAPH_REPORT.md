# Graph Report - Cartefidelité  (2026-10-05)

## Corpus Check
- 750 files · ~4,844,613 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: (none) 6, .example 4, .css 4)

## Summary
- 4154 nodes · 13058 edges · 190 communities (157 shown, 33 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc580d69`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scan/route.ts
- loyalty-context.ts
- next
- merchant-card-template-service.ts
- env.ts
- react
- loyalty-program.ts
- stripe.ts
- google-wallet-appearance.ts
- loyalty-widget-view.tsx
- loyalty-widget.ts
- validation.ts
- VisualPicker
- card-template-schema.ts
- ad-visual-workflow.ts
- fife-life/merchant-detail.tsx
- rateLimit
- google-wallet.ts
- [id]/merchant-detail.tsx
- qr-cache.ts
- clients/ui.tsx
- requireUser
- super-admin.test.ts
- jsonError
- google-auth.ts
- hosts.ts
- jsonOk
- preview-data.ts
- ad-visual-parts.tsx
- card-editor-properties.tsx
- customer-profile.ts
- employees/[id]/route.ts
- solde/ui.tsx
- card-editor.tsx
- package.json
- google-wallet-media-crop.tsx
- statistiques-panel.tsx
- ad-visuals.ts
- customer-onboarding.ts
- What You Must Do When Invoked
- stripe-webhook-marketing.test.ts
- media-storage.ts
- loyalty-commit.test.ts
- insight-period.ts
- loyalty-service.ts
- demo-session.ts
- src/app/page.tsx
- compilerOptions
- card-editor-polish.test.ts
- @prisma/client
- preferences/route.ts
- qa-login.ts
- ref_node_path
- dependencies
- getActiveStripeMode
- email.ts
- devDependencies
- insight-stats.ts
- sponsored-slot.test.tsx
- diagnose-google-wallet-campaign-hero.ts
- sponsored-selection.ts
- globalObjectBody
- scripts
- facturation/ui.tsx
- platform-stats.ts
- demo-mode.ts
- card-enlarged-view.tsx
- ref_fs
- AdDetailPage
- stripe-webhook-route.test.ts
- fake-ad-db.ts
- campaign-en-cours.ts
- merchant-card-renderer.tsx
- AdvantagesEditor
- unsubscribe-token.ts
- cards-index.tsx
- loyalty-commit.ts
- profile-page.tsx
- ads/[id]/confirm/route.ts
- card-template-background-style.ts
- super-admin-session.ts
- cartes.js
- Fideto
- docker-entrypoint.sh
- notifications-center.tsx
- campaign-moderation-home.tsx
- ad-visual-journeys.test.ts
- Notes pour le prochain agent - Carousel de cartes
- Cartes de fidélité — pack pour Cursor
- demo.js
- caisse-client-number.test.ts
- progress-ring.tsx
- semi-gauge.tsx
- campagnes/ui.tsx
- deploy.sh
- eslint.config.mjs
- next-env.d.ts
- postcss.config.mjs
- sw.js
- graphify reference: extra exports and benchmark
- [kind]/route.ts
- lib/campaign-worker.ts
- EmployeeDetailPanel
- sponsored-test-broadcast.ts
- apply-ad-visual-crop.ts
- graphify reference: query, path, explain
- campaign-worker.test.ts
- profile-shared.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- requireSuperAdmin
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- campaign-crud-routes.test.ts
- insight-definitions.ts
- use-wallet-unlock-animation.ts
- ad-confirm-route.test.ts
- prisma.ts
- campaign-confirm-route.test.ts
- qr.ts
- getSessionUser
- create-super-admin.ts
- HourlySchedulePicker
- demo-visual.ts
- scan/ui.tsx
- sponsored-hours-pricing.ts
- app/ui.tsx
- employee-invitation-service.ts
- super-admin-campaign-moderation.test.ts
- landing-header.tsx
- cn
- programme/ui.tsx
- landing-page.test.ts
- webhook/route.ts
- push-client.ts
- card-deck.tsx
- campaign-fixes.test.ts
- admin-ad-fiche.test.ts
- marketing-topup-route.test.ts
- customer-qr.ts
- ad-google-wallet-visual-workflow.ts
- carte/page.tsx
- loyalty-service.test.ts
- exchange/route.ts
- src/app/layout.tsx
- customer-preferences-route.test.ts
- wallet-home.tsx
- sponsored-test-broadcast.test.ts
- generate-pwa-icons.mjs
- sponsored-slot.tsx
- finalisation/page.tsx
- demo-routing.test.ts
- employee-session.ts
- landing-hero-visual.tsx
- theme-toggle.tsx
- ad-detail.tsx
- CampaignWizard
- caisse-scan.test.ts
- visuels/[merchantId]/[filename]/route.ts
- vitest
- landing-faq.tsx
- avatar-storage.ts
- statistics/route.ts
- staff-notification-delivery.ts
- landing-footer.tsx
- google-wallet-doctor.ts
- sponsored-test-broadcast-global-wallet.integration.test.ts
- resolveMediaFilePath
- SettingsPage
- carte/avantages/page.tsx
- super-admin/layout.tsx
- use-media-query.ts
- ref_fs_promises
- ref_motion_react
- ref_next_font_google
- ref_next_headers
- ref_next_link
- ref_next_navigation
- ref_next_server
- ref_node_fs_promises
- ref_react_dom_client
- ref_react_dom_server
- ref_vitest_config
- employe/layout.tsx

## God Nodes (most connected - your core abstractions)
1. `jsonError()` - 269 edges
2. `jsonOk()` - 235 edges
3. `requireMutatingRequest()` - 171 edges
4. `next` - 162 edges
5. `prisma` - 154 edges
6. `vitest` - 132 edges
7. `clientIp()` - 123 edges
8. `readJson()` - 122 edges
9. `react` - 117 edges
10. `userAgent()` - 112 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `isGoogleWalletConfigured()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/env.ts
- `main()` --calls--> `globalObjectBody()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/google-wallet.ts
- `main()` --calls--> `syncGoogleWalletGlobalObject()`  [EXTRACTED]
  scripts/diagnose-google-wallet-campaign-hero.ts → src/lib/google-wallet.ts
- `main()` --calls--> `getActiveMerchantLoyaltyContext()`  [EXTRACTED]
  scripts/diagnose-loyalty-program.ts → src/lib/loyalty-context.ts
- `approvedAd()` --calls--> `PATCH()`  [EXTRACTED]
  tests/campaign-fixes.test.ts → src/app/api/merchant/ads/[id]/route.ts

## Import Cycles
- 2-file cycle: `src/lib/card-template-schema.ts -> src/lib/card-template-validation.ts -> src/lib/card-template-schema.ts`

## Communities (190 total, 33 thin omitted)

### Community 0 - "scan/route.ts"
Cohesion: 0.17
Nodes (15): logScanBody(), POST(), scanVia(), CaisseScanError, maskClientNumberForLog(), findUserByCustomerNumber(), processCaisseScan(), processCaisseScanByClientNumber() (+7 more)

### Community 1 - "loyalty-context.ts"
Cohesion: 0.12
Nodes (32): dynamic, MerchantProfilePage(), formatAddress(), MerchantProfile(), join(), MerchantProfileData, safeExternalUrl(), buildProgramSnapshot() (+24 more)

### Community 2 - "next"
Cohesion: 0.07
Nodes (52): nextConfig, next, CaissePage(), CampagneFichePage(), CampagnesPage(), SoldeMarketingPage(), CustomerDetailPage(), ClientsPage() (+44 more)

### Community 3 - "merchant-card-template-service.ts"
Cohesion: 0.07
Nodes (53): LegacyCardEditorRedirect(), CardEditorVariantRoute(), ALL_MERCHANT_CARD_SLOTS, CARD_SLOT_SLUGS, CARD_SLOT_TITLES, cardSlotEditorPath(), cardSlotForLoyaltyMode(), isLoyaltyProgramSlot() (+45 more)

### Community 4 - "env.ts"
Cohesion: 0.12
Nodes (12): dynamic, robots(), dynamic, sitemap(), assertSameOrigin(), CsrfError, env, getAllowedOrigins() (+4 more)

### Community 5 - "react"
Cohesion: 0.06
Nodes (37): react, SettingsPanel(), Merchant, MerchantPublic(), CustomerLoginPage(), CustomerLoginForm(), googleMessage(), recoverMessage() (+29 more)

### Community 6 - "loyalty-program.ts"
Cohesion: 0.09
Nodes (35): buildScanResult(), CAISSE_GRANT_TTL_MS, block(), buildNextBenefit(), centsToEarnAtLeast(), EarnEvaluation, evaluateEarn(), formatDurationMinutes() (+27 more)

### Community 7 - "stripe.ts"
Cohesion: 0.08
Nodes (43): GET(), attachReceipts(), BillingError, CANCELLABLE, CancellationPreview, effectiveEndDate(), InvoicesResult, listMerchantInvoices() (+35 more)

### Community 8 - "google-wallet-appearance.ts"
Cohesion: 0.16
Nodes (11): contrastWithWhite(), GOOGLE_WALLET_RECOMMENDED_COLORS, GoogleWalletAppearance, googleWalletAppearanceSchema, googleWalletButtonLabelSchema, GoogleWalletConfigMap, googleWalletHexSchema, isReadableGoogleWalletColor() (+3 more)

### Community 9 - "loyalty-widget-view.tsx"
Cohesion: 0.08
Nodes (32): BigBalance(), BigCounter(), CounterWithNextGoal(), glowStyle(), LoyaltyWidgetProgress, LoyaltyWidgetProgressInput, LoyaltyWidgetView(), pct() (+24 more)

### Community 10 - "loyalty-widget.ts"
Cohesion: 0.08
Nodes (48): LoyaltyGaugeThumbnail(), LoyaltyWidgetStylePicker(), applyEditorAutoFix(), dedupeIssues(), EditorValidationIssue, EditorValidationSummary, migrateLegacyOnLoad(), missingWidgetLabel() (+40 more)

### Community 11 - "validation.ts"
Cohesion: 0.05
Nodes (63): zod, POST(), schema, GET(), POST(), POST(), GET(), GET() (+55 more)

### Community 12 - "VisualPicker"
Cohesion: 0.31
Nodes (11): deleteCampaignMediaUrl(), loadImageElement(), readFileAsDataUrl(), uploadCampaignMedia(), VisualPicker(), dropSelfFiles(), onFidetoFilesSelected(), onSelfFileSelected() (+3 more)

### Community 13 - "card-template-schema.ts"
Cohesion: 0.07
Nodes (57): ALL_HANDLES, CardEditorCanvas(), onKey(), onMove(), CORNER_HANDLES, DragState, GuideLine, handlesForElement() (+49 more)

### Community 14 - "ad-visual-workflow.ts"
Cohesion: 0.16
Nodes (25): POST(), POST(), schema, PATCH(), approveSubmittedVersion(), createVersion(), JourneyStage, LIVE_LIKE (+17 more)

### Community 15 - "fife-life/merchant-detail.tsx"
Cohesion: 0.12
Nodes (25): CustomerProgramView, DETAIL_TABS, DetailTabId, EMPTY_RECENT_ACTIVITY, MerchantCardDetail(), fallbackCopyLink(), shareCard(), MerchantRewardProgressPanel() (+17 more)

### Community 16 - "rateLimit"
Cohesion: 0.09
Nodes (29): schema, POST(), POST(), POST(), dynamic, logCustomerQr(), POST(), runtime (+21 more)

### Community 17 - "google-wallet.ts"
Cohesion: 0.12
Nodes (37): accessToken(), assertConfigured(), buildGoogleWalletIds(), classProfileForMode(), createGlobalGoogleWalletSaveUrl(), createMerchantGoogleWalletSaveUrl(), customerQrValue(), dedicatedWalletHeroInUri() (+29 more)

### Community 18 - "[id]/merchant-detail.tsx"
Cohesion: 0.08
Nodes (24): MEDIA_TO_APPEARANCE_KEY, MerchantDetailPage(), clearWalletLocalPreviews(), reloadMerchant(), saveWalletDraft(), walletAction(), RECOMMENDED_WALLET_COLORS, revokeWalletPreviews() (+16 more)

### Community 19 - "qr-cache.ts"
Cohesion: 0.07
Nodes (46): DEMO_TIER_POINTS, GlobalCard(), GlobalCardMode, loyaltyCardDisplayName(), InteractiveCardShell(), InteractiveCardShellProps, InteractiveLoyaltyCard(), InteractiveLoyaltyCardProps (+38 more)

### Community 20 - "clients/ui.tsx"
Cohesion: 0.16
Nodes (14): Customer, CustomerDetail, CustomerDetailPanel(), CustomerInsight, CustomersPanel(), CustomerStats, CustomerTx, DEMO (+6 more)

### Community 21 - "requireUser"
Cohesion: 0.09
Nodes (32): POST(), GET(), POST(), POST(), schema, DELETE(), GET(), dynamic (+24 more)

### Community 22 - "super-admin.test.ts"
Cohesion: 0.30
Nodes (11): BillingSummary, buildBillingSummary(), computeArr(), computeBillableMrr(), computeMrr(), computeTrialPotentialMrr(), normalizeToMrr(), sumCollectedRevenue() (+3 more)

### Community 23 - "jsonError"
Cohesion: 0.07
Nodes (49): GET(), PATCH(), GET(), POST(), GET(), GET(), GET(), GET() (+41 more)

### Community 24 - "google-auth.ts"
Cohesion: 0.07
Nodes (40): GET(), GET(), AppLoginPage(), CustomerSignupPage(), CustomerSignupForm(), FIDETO_MONTHLY, metadata, PACK_SETUP (+32 more)

### Community 25 - "hosts.ts"
Cohesion: 0.12
Nodes (30): isProduction(), appOriginForPublicLinks(), canonicalOrigin(), employeeInvitationUrl(), employeeOriginForPublicLinks(), FORBIDDEN_PUBLIC_HOSTS, hostMatches(), hostnameForbidden() (+22 more)

### Community 26 - "jsonOk"
Cohesion: 0.09
Nodes (80): POST(), POST(), POST(), POST(), POST(), POST(), POST(), POST() (+72 more)

### Community 27 - "preview-data.ts"
Cohesion: 0.14
Nodes (12): PREVIEW_BENEFITS, PREVIEW_CARDS, PREVIEW_PROFILE_HISTORY, resetQrCache(), BenefitEntry, formatLoyaltyEntry(), HistoryCategory, HistoryEntry (+4 more)

### Community 28 - "ad-visual-parts.tsx"
Cohesion: 0.08
Nodes (40): AdStatus, api(), Detail, euros(), HistoryRow, MerchantCampaignFiche(), addSources(), onFile() (+32 more)

### Community 29 - "card-editor-properties.tsx"
Cohesion: 0.13
Nodes (21): CardEditorProperties(), patchRect(), REQUIRED_BY_SLOT, TEXT_TYPES, qrOverlapsOthers(), BACKGROUND_FIT_LABELS, DATA_KEY_LABELS, dataKeyLabel() (+13 more)

### Community 30 - "customer-profile.ts"
Cohesion: 0.36
Nodes (11): GET(), AccountPage(), ParametresPage(), ensureCustomerPreferences(), getProfileUser(), serializePreferences(), serializeProfile(), src_lib_demo_visual_client_demo_cookie (+3 more)

### Community 31 - "employees/[id]/route.ts"
Cohesion: 0.24
Nodes (15): GET(), GET(), mapEmployee(), PATCH(), employeeLoginUrl(), GET(), mapEmployee(), POST() (+7 more)

### Community 32 - "solde/ui.tsx"
Cohesion: 0.16
Nodes (15): historyDateKey(), HistoryFilter, matchesFilter(), SoldeMarketingPanel(), topup(), BalanceData, DEMO_BALANCE, estimateSponsorPricing() (+7 more)

### Community 33 - "card-editor.tsx"
Cohesion: 0.10
Nodes (29): buildElementCatalog(), CardEditorPage(), addElement(), applyAutoFix(), fitToScreen(), onResize(), publish(), runResetAction() (+21 more)

### Community 34 - "package.json"
Cohesion: 0.08
Nodes (24): description, engines, node, name, prisma, seed, private, version (+16 more)

### Community 35 - "google-wallet-media-crop.tsx"
Cohesion: 0.13
Nodes (20): CoverCropEditor(), onHandlePointerDown(), move(), up(), CoverCropEditorSpec, GoogleWalletMediaCrop(), confirm(), onPointerMove() (+12 more)

### Community 36 - "statistiques-panel.tsx"
Cohesion: 0.09
Nodes (32): ApiResponse, COMPARISON_METRICS, FideliteTab(), FinancesTab(), fmtDays(), fmtNum(), FrequentationTab(), LockedPlaceholder (+24 more)

### Community 37 - "ad-visuals.ts"
Cohesion: 0.12
Nodes (21): AD_SOURCE_MAX_IMAGES, AD_VISUAL_EXPORT_PX, AD_VISUAL_MAX_BYTES, AD_VISUAL_MAX_PX, AD_VISUAL_MIN_PX, AD_VISUAL_RATIO, AdVisualFileKind, buildZip() (+13 more)

### Community 38 - "customer-onboarding.ts"
Cohesion: 0.11
Nodes (29): CarteLayout(), CompteLayout(), NotificationsLayout(), issueCustomerAccessToken(), enforceCustomerWalletAccess(), beginCustomerOnboarding(), buildAccountRecoveryUrl(), buildEmailVerificationUrl() (+21 more)

### Community 39 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 40 - "stripe-webhook-marketing.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent, creditTopup (+5 more)

### Community 41 - "media-storage.ts"
Cohesion: 0.14
Nodes (26): appearanceKeyForGoogleWalletMedia(), assertExactDimensions(), deleteCampaignMedia(), deleteCardBackground(), getUploadsRoot(), GoogleWalletMediaKind, GoogleWalletPublicMediaKind, GoogleWalletPublishedMediaConfig (+18 more)

### Community 42 - "loyalty-commit.test.ts"
Cohesion: 0.09
Nodes (21): entitlementFindMany, entitlementUpdate, entitlementUpdateMany, grant, grantFindFirst, grantUpdate, loyaltyProgramFindUnique, membership (+13 more)

### Community 43 - "insight-period.ts"
Cohesion: 0.21
Nodes (24): addParisDays(), addParisMonths(), bucketKey(), enumerateBucketKeys(), enumerateDayKeys(), enumerateMonthKeys(), enumerateWeekKeys(), InsightBucket (+16 more)

### Community 44 - "loyalty-service.ts"
Cohesion: 0.12
Nodes (28): GET(), sortOrder(), CardPage(), dynamic, formatActivityFromTransaction(), getCustomerMerchantRewardProgress(), updateWalletBalance(), applyAdjustment() (+20 more)

### Community 45 - "demo-session.ts"
Cohesion: 0.15
Nodes (19): GET(), GET(), GET(), GET(), GET(), demoCookieNamesForRole(), demoEnterTarget(), DemoRole (+11 more)

### Community 46 - "src/app/page.tsx"
Cohesion: 0.10
Nodes (24): BENTO_ITEMS, CLIENT_STEPS, GUARANTEES, HomePage(), MERCHANT_BENEFITS, metadata, PROOF_ITEMS, ArrowRightIcon() (+16 more)

### Community 47 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 48 - "card-editor-polish.test.ts"
Cohesion: 0.17
Nodes (22): useWalletEvents(), connect(), disconnect(), onVisibility(), containsForbiddenTechnicalLabel(), qrVisuallySquareInPixels(), canUseSessionStorage(), getStoredLastEventId() (+14 more)

### Community 49 - "@prisma/client"
Cohesion: 0.12
Nodes (30): @prisma/client, GET(), loadProgram(), POST(), balanceFieldForUnit(), activeEligibleRewards(), assertRewardLimit(), countConfiguredRewards() (+22 more)

### Community 50 - "preferences/route.ts"
Cohesion: 0.24
Nodes (10): GET(), PATCH(), bodySchema, POST(), CONSENT_FIELDS, CONSENT_POLICY_VERSION, ConsentField, extractConsentChanges() (+2 more)

### Community 51 - "qa-login.ts"
Cohesion: 0.13
Nodes (26): assertNoUnknownArgs(), main(), parseTtlMinutes(), assertQaLoginTtlMinutes(), auditQaLogin(), configuredSubjectId(), createQaMagicLoginToken(), CreateQaMagicLoginTokenOptions (+18 more)

### Community 52 - "ref_node_path"
Cohesion: 0.04
Nodes (32): ref_node_fs, ref_node_path, ref_node_url, playwright, outDir, pages, OUT, OUT (+24 more)

### Community 53 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, bcryptjs, google-auth-library, html5-qrcode, jose, motion, next, next-themes (+12 more)

### Community 54 - "getActiveStripeMode"
Cohesion: 0.16
Nodes (19): stripe, main(), GET(), GET(), diagnoseAdDelivery(), selectSponsoredForCustomerDebug, getStripeClient(), getActiveStripeMode() (+11 more)

### Community 55 - "email.ts"
Cohesion: 0.17
Nodes (26): nodemailer, ContactPage(), buildCampaignEmailContent(), buildCustomerFinalizationContent(), buildInvitationContent(), CampaignEmailInput, CustomerFinalizationEmailInput, emailConfigHint() (+18 more)

### Community 56 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, eslint-config-next, happy-dom, playwright, tailwindcss, @tailwindcss/postcss, @types/bcryptjs (+8 more)

### Community 57 - "insight-stats.ts"
Cohesion: 0.10
Nodes (31): InsightRange, percentChange(), buildFinancial(), buildOverview(), buildRetention(), buildRewards(), buildSegments(), buildTeam() (+23 more)

### Community 58 - "sponsored-slot.test.tsx"
Cohesion: 0.11
Nodes (10): MobilePlacementPreview(), resetSponsoredSessionState(), AD, calls, FakeIntersectionObserver, flush(), mount(), Observer (+2 more)

### Community 59 - "diagnose-google-wallet-campaign-hero.ts"
Cohesion: 0.28
Nodes (13): main(), probePublicImage(), redactUrl(), approvedGoogleWalletHeroUrl(), explainWalletHeroResolution(), isDedicatedWalletHeroStorageUrl(), resolveApprovedWalletHeroForGoogle(), resolveCampaignModuleHeroPathOrUrl() (+5 more)

### Community 60 - "sponsored-selection.ts"
Cohesion: 0.07
Nodes (47): POST(), schema, GET(), GET(), previewResponse(), withResolvedImage(), staffContext(), resolveSponsoredImageUrl() (+39 more)

### Community 61 - "globalObjectBody"
Cohesion: 0.28
Nodes (16): appLinkData(), availableRewardModules(), buildGoogleWalletMerchantView(), cardUrl(), classTemplateInfo(), globalClassPatchBody(), globalObjectBody(), imageData() (+8 more)

### Community 62 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, db:migrate, db:migrate:dev, db:seed, db:studio, dev, diagnose:wallet-hero (+7 more)

### Community 63 - "facturation/ui.tsx"
Cohesion: 0.19
Nodes (14): api(), BillingPanel(), confirmCancellation(), openPortal(), startCancellation(), Cancellation, day(), Invoice (+6 more)

### Community 64 - "platform-stats.ts"
Cohesion: 0.29
Nodes (12): GET(), dateKey(), fillDailySeries(), getPlatformAlerts(), getPlatformOverview(), getPlatformRecentActivity(), getPlatformTimeSeries(), getSponsoredAdsStats() (+4 more)

### Community 65 - "demo-mode.ts"
Cohesion: 0.18
Nodes (14): CaisseAliasPage(), EmployeeHomePage(), EmployeeScanPage(), EMPLOYEE_DEMO_COOKIE, isClientDemoMode(), isDemoCookie(), isPublicDemoEnabled(), MERCHANT_DEMO_COOKIE (+6 more)

### Community 66 - "card-enlarged-view.tsx"
Cohesion: 0.11
Nodes (21): motion, react-dom, CardEnlargedView(), CardEnlargedViewProps, isFifeLifeCard(), CardsSheet(), DiscoverPage(), Merchant (+13 more)

### Community 67 - "ref_fs"
Cohesion: 0.07
Nodes (21): ref_fs, ref_path, main(), outDir, shot(), outDir, main(), outDir (+13 more)

### Community 68 - "AdDetailPage"
Cohesion: 0.22
Nodes (14): AdDetailPage(), confirmBannerCrop(), confirmReason(), patch(), requestSend(), run(), sendProposal(), startTestBroadcast() (+6 more)

### Community 69 - "stripe-webhook-route.test.ts"
Cohesion: 0.11
Nodes (15): adRequestFindUnique, adRequestUpdate, campaignFindUnique, campaignPaymentFindFirst, campaignPaymentFindUnique, campaignPaymentUpdate, campaignUpdate, constructStripeWebhookEvent (+7 more)

### Community 70 - "fake-ad-db.ts"
Cohesion: 0.11
Nodes (20): END, fake, h, previewCall(), START, END, fake, START (+12 more)

### Community 71 - "campaign-en-cours.ts"
Cohesion: 0.15
Nodes (13): CampagnesPanel(), statusTone(), AD_EN_COURS, AdEnCoursInput, ANNOUNCE_EN_COURS, CampaignEnCoursInput, isCampaignEnCours(), isSponsoredAdLiveNow() (+5 more)

### Community 72 - "merchant-card-renderer.tsx"
Cohesion: 0.07
Nodes (48): LinearGauge(), MerchantCardPublicPreview(), COMPACT_HIDDEN, displayClientName(), elementShellStyle(), ElementView(), MerchantCardDisplayMode, MerchantCardRenderer() (+40 more)

### Community 73 - "AdvantagesEditor"
Cohesion: 0.26
Nodes (16): AdvantagesEditor(), deleteReward(), handleRewardSave(), isCurrentReward(), markDirty(), moveReward(), openCreateReward(), openEditReward() (+8 more)

### Community 74 - "unsubscribe-token.ts"
Cohesion: 0.22
Nodes (10): jose, secretKey(), signUnsubscribeToken(), UnsubscribePayload, UnsubscribeScope, UnsubscribeTokenError, unsubscribeUrl(), verifyUnsubscribeToken() (+2 more)

### Community 75 - "cards-index.tsx"
Cohesion: 0.08
Nodes (23): recharts, ALL_SLOTS, cardCounts(), CardsIndexPage(), hasPublishedActiveSlot(), MerchantCardRow, modeLabel(), pickCurrentTemplate() (+15 more)

### Community 76 - "loyalty-commit.ts"
Cohesion: 0.09
Nodes (41): assertEarnProgramRules(), appliedTierLabel(), assembleView(), buildView(), customerName(), evaluateCustomerRewards(), isMerchantActive(), isProgramActive() (+33 more)

### Community 77 - "profile-page.tsx"
Cohesion: 0.18
Nodes (15): AvatarFileInput(), AvatarPreviewEditor(), cropCircleToDataUrl(), loadImage(), useAvatarEditor(), GlassBottomSheet(), SheetAction(), HistoryFilter (+7 more)

### Community 78 - "ads/[id]/confirm/route.ts"
Cohesion: 0.12
Nodes (38): billingCustomer(), computeAdPricing(), GET(), InsufficientBalance, pendingCheckout(), POST(), QuotaExhausted, POST() (+30 more)

### Community 79 - "card-template-background-style.ts"
Cohesion: 0.47
Nodes (4): CardTemplateBackground(), buildCardBackgroundImageStyle(), CardBackgroundSettings, DEFAULT_BACKGROUND

### Community 80 - "super-admin-session.ts"
Cohesion: 0.05
Nodes (40): SuperAdminSubscriptionsPage(), SubscriptionsPage(), load(), toggleInsight(), AuditPage(), SuperAdminAuditPage(), Check, DiagnosticPage() (+32 more)

### Community 81 - "cartes.js"
Cohesion: 0.53
Nodes (5): getViewModel(), mount(), update(), nonNegativeNumber(), safeImageUrl()

### Community 82 - "Fideto"
Cohesion: 0.13
Nodes (14): Checklist de déploiement, Configuration Google Wallet, Création des sous-domaines DNS, Déploiement d’une mise à jour, Déploiement initial, Déploiement VPS sans Docker local, Fideto, Installation locale (sans Docker) (+6 more)

### Community 83 - "docker-entrypoint.sh"
Cohesion: 0.70
Nodes (4): fail(), is_placeholder_secret(), docker-entrypoint.sh script, validate_production_secrets()

### Community 84 - "notifications-center.tsx"
Cohesion: 0.19
Nodes (10): dynamic, NotificationsPage(), DEMO_NOTIFICATIONS, kindLabel(), NotificationItem, NotificationKind, NotificationMerchant, NotificationsCenter() (+2 more)

### Community 85 - "campaign-moderation-home.tsx"
Cohesion: 0.20
Nodes (8): AD_STATUS_FILTER_OPTIONS, AD_STATUS_LABELS, AdRequest, AdStatus, CampaignModerationHome(), formatCents(), NetworkCampaign, RejectTarget

### Community 86 - "ad-visual-journeys.test.ts"
Cohesion: 0.14
Nodes (15): submit(), adminPropose(), createAd(), ctx(), dataUrl(), fake, fetchFile(), h (+7 more)

### Community 87 - "Notes pour le prochain agent - Carousel de cartes"
Cohesion: 0.20
Nodes (9): Clics sur les cartes - DÉSACTIVÉ, Concept, Emplacement du code, Fonctionnalité EN PAUSE, Implémentation, Notes pour le prochain agent - Carousel de cartes, Paramètres actuels, Système de carousel actuel (+1 more)

### Community 88 - "Cartes de fidélité — pack pour Cursor"
Cohesion: 0.22
Nodes (8): Adaptation et validation, Cartes de fidélité — pack pour Cursor, Démarrage, Fonds, cadrage et QR, Intégration minimale avec données dynamiques, Paliers et images de référence, Paramètres, À donner à Cursor

### Community 90 - "caisse-client-number.test.ts"
Cohesion: 0.26
Nodes (10): deriveClientNumber(), formatClientNumberDisplay(), normalizeClientNumber(), normalizeCustomerNumber(), resolveClientNumber(), scanSchema, fifeLifeQrTokenCreate, fifeLifeQrTokenFindUnique (+2 more)

### Community 93 - "campagnes/ui.tsx"
Cohesion: 0.06
Nodes (21): AD_STATUS_LABELS, AdRequest, AdStatus, Audience, AUDIENCE_LABELS, CampaignSummary, Channel, CHANNEL_LABELS (+13 more)

### Community 100 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 101 - "[kind]/route.ts"
Cohesion: 0.24
Nodes (5): ref_os, GET(), notFound(), loadRoute(), PNG_BYTES

### Community 102 - "lib/campaign-worker.ts"
Cohesion: 0.09
Nodes (31): log(), loop(), requestShutdown(), sleep(), runAdLifecycleTick(), networkAudienceWhere(), backoffMinutesForAttempt(), claimNextScheduledCampaign() (+23 more)

### Community 103 - "EmployeeDetailPanel"
Cohesion: 0.29
Nodes (6): EmployeeDetailPanel(), patchEmployee(), reactivate(), resendInvite(), saveProfile(), suspend()

### Community 104 - "sponsored-test-broadcast.ts"
Cohesion: 0.14
Nodes (29): DELETE(), GET(), POST(), buildGlobalWalletValueAddedModule(), globalWalletCampaignDetailUri(), GlobalWalletCampaignModule, localized(), resolveGlobalWalletCampaignHeroUrl() (+21 more)

### Community 105 - "apply-ad-visual-crop.ts"
Cohesion: 0.26
Nodes (11): sharp, renderAdVisualCrop(), AD_BANNER_CROP_SPEC, AD_GOOGLE_WALLET_HERO_CROP_SPEC, AD_VISUAL_CROP_SPECS, AdVisualCropSpec, AdVisualCropTarget, parseCropState() (+3 more)

### Community 106 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 107 - "campaign-worker.test.ts"
Cohesion: 0.12
Nodes (15): baseCampaign, campaignDeliveryCount, campaignDeliveryCreateMany, campaignDeliveryFindMany, campaignDeliveryUpdate, campaignUpdate, customerMembershipFindMany, customerPreferencesFindMany (+7 more)

### Community 108 - "profile-shared.tsx"
Cohesion: 0.28
Nodes (11): APP_VERSION, APPEARANCE_OPTIONS, AppearanceRow(), demoQuery(), EditField, fieldLabels, PasswordStrength(), ProfileShell() (+3 more)

### Community 109 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 110 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 111 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 114 - "requireSuperAdmin"
Cohesion: 0.08
Nodes (39): GET(), GET(), GET(), GET(), GET(), POST(), GET(), GET() (+31 more)

### Community 118 - "campaign-crud-routes.test.ts"
Cohesion: 0.20
Nodes (8): campaignCreate, campaignFindFirst, campaignFindMany, campaignUpdate, refundCampaignDebit, requireMerchantAdmin, requireMutatingRequest, writeAudit

### Community 120 - "use-wallet-unlock-animation.ts"
Cohesion: 0.19
Nodes (17): GET(), deliver(), sendNewEvents(), sendPendingUnlocks(), isDocumentVisible(), UnlockRevealPhase, useWalletUnlockAnimation(), flushWhenVisible() (+9 more)

### Community 121 - "ad-confirm-route.test.ts"
Cohesion: 0.12
Nodes (13): adRequestFindFirst, adRequestUpdate, adRequestUpdateMany, campaignUpdate, createCampaignCheckoutSession, executeRaw, FakeStripeNotConfiguredError, getQuotaUsage (+5 more)

### Community 122 - "prisma.ts"
Cohesion: 0.08
Nodes (31): GET(), FILTER_MAP, GET(), dynamic, markReadSchema, POST(), dynamic, runtime (+23 more)

### Community 123 - "campaign-confirm-route.test.ts"
Cohesion: 0.12
Nodes (17): baseCampaign, campaignFindFirst, campaignUpdate, campaignUpdateMany, debitForCampaign, estimateMerchantMembersAudience, estimateNetworkLocalAudience, getMarketingBalanceCents (+9 more)

### Community 124 - "qr.ts"
Cohesion: 0.26
Nodes (10): main(), prisma, requiredEnv(), upsertEmployee(), assertQrUsable(), QrError, QrPayload, secretKey() (+2 more)

### Community 125 - "getSessionUser"
Cohesion: 0.29
Nodes (7): ProEntryPage(), SPACES, getEmployeeSession(), LandingAuthTargets, resolveLandingAuthTargets(), getSessionUser(), { getSessionUserMock, getEmployeeSessionMock }

### Community 126 - "create-super-admin.ts"
Cohesion: 0.50
Nodes (4): bcryptjs, main(), prisma, required()

### Community 127 - "HourlySchedulePicker"
Cohesion: 0.22
Nodes (14): addDaysToDateInput(), defaultSlotFor(), firstSelectableDate(), HourlySchedulePicker(), addDay(), hoursToSlots(), scheduleDayError(), slotsToHours() (+6 more)

### Community 128 - "demo-visual.ts"
Cohesion: 0.14
Nodes (14): CarteIdentitePage(), PREVIEW_HISTORY, PREVIEW_PREFERENCES, PREVIEW_PROFILE, DEMO_LOYALTY_OVERVIEW, DEMO_EMAIL, DEMO_EMPLOYEE, DEMO_FIRST_NAME (+6 more)

### Community 129 - "scan/ui.tsx"
Cohesion: 0.07
Nodes (58): ADMIN_PERMISSIONS, CaisseScreen(), ScanResult, EmployeeProfile, EmployeeScanScreen(), Phase, ScanResult, statusLabel() (+50 more)

### Community 130 - "sponsored-hours-pricing.ts"
Cohesion: 0.18
Nodes (11): slotAmountCents(), parisHourInstant(), MAX_SPONSORED_DAYS, MIN_HOURS_PER_DAY, MIN_SPONSORED_DAYS, parisSlotEnd(), rateForParisHour(), SPONSORED_HOUR_RATE_CENTS (+3 more)

### Community 131 - "app/ui.tsx"
Cohesion: 0.18
Nodes (6): HomeStats, KPI_ICONS, MerchantHome(), QUICK_ACTIONS, StatsPreview, TrendMetric

### Community 132 - "employee-invitation-service.ts"
Cohesion: 0.17
Nodes (17): employeeCookieName(), employeeTokenFromRequest(), hasEmployeeCookie(), buildInvitationLink(), canEmployeeAccess(), createInvitationToken(), hashInvitationToken(), INVITATION_ERROR (+9 more)

### Community 133 - "super-admin-campaign-moderation.test.ts"
Cohesion: 0.18
Nodes (9): campaignFindUnique, campaignPaymentUpdate, campaignUpdate, refundCampaignDebit, refundCampaignPayment, refundIncludedQuota, requireMutatingRequest, requireSuperAdmin (+1 more)

### Community 134 - "landing-header.tsx"
Cohesion: 0.33
Nodes (8): MenuIcon(), XIcon(), isInternalRoute(), LandingHeader(), isInternalRoute(), LandingMobileNav(), LANDING_NAV_LINKS, MERCHANT_PROGRAM_HREF

### Community 135 - "cn"
Cohesion: 0.06
Nodes (45): DEMO, Employee, EmployeesPanel(), formatActivity(), statusBadgeLabel(), statusTone(), FidelisationPanel(), DashboardLayout() (+37 more)

### Community 136 - "programme/ui.tsx"
Cohesion: 0.17
Nodes (13): DEMO_CONFIG, MODES, modeTitle(), PROGRAM_STEPS, ProgramConfigurator(), goToStep(), isCurrentReward(), primaryFooterAction() (+5 more)

### Community 137 - "landing-page.test.ts"
Cohesion: 0.17
Nodes (10): authTargets, connexionUi, faq, footer, header, heroVisual, mobileNav, page (+2 more)

### Community 138 - "webhook/route.ts"
Cohesion: 0.10
Nodes (29): handleChargeRefunded(), handleCheckoutSessionCompleted(), handleCheckoutSessionExpired(), handlePaymentIntentFailed(), handleStripeEvent(), paymentIntentIdOf(), POST(), isCancellable() (+21 more)

### Community 139 - "push-client.ts"
Cohesion: 0.39
Nodes (5): enablePushNotifications(), getPushSupportState(), isIosNotStandalone(), PushSupportState, urlBase64ToUint8Array()

### Community 140 - "card-deck.tsx"
Cohesion: 0.20
Nodes (12): activeCardFromDeck(), CardDeck(), handleCardExpand(), handleDragEnd(), handleKeyDown(), snapTo(), DeckItem, demoStartIndex() (+4 more)

### Community 141 - "campaign-fixes.test.ts"
Cohesion: 0.25
Nodes (13): approvedAd(), asAdmin(), asMerchant(), ctx(), dataUrl(), fake, futureSchedule(), h (+5 more)

### Community 142 - "admin-ad-fiche.test.ts"
Cohesion: 0.23
Nodes (7): adminStage(), ctx(), fake, h, jsonReq(), moderate(), propose()

### Community 143 - "marketing-topup-route.test.ts"
Cohesion: 0.20
Nodes (8): createMarketingTopupCheckoutSession, FakeStripeNotConfiguredError, ledgerCreate, ledgerUpdate, requireMerchantAdmin, requireMutatingRequest, stripeMode, writeAudit

### Community 144 - "customer-qr.ts"
Cohesion: 0.46
Nodes (7): qrcode, ensureCustomerMembershipForSlug(), ensureCustomerQrToken(), generateCustomerQrDataUrl(), isUniqueViolation(), logCustomerQr(), tryEnsureCustomerMembershipForSlug()

### Community 145 - "ad-google-wallet-visual-workflow.ts"
Cohesion: 0.33
Nodes (10): AdWalletCtx, approveWalletVisualAsIs(), clearWalletVisual(), merchantRespondWalletVisual(), nextWalletNumber(), notify(), proposeWalletVisual(), WalletVersionFiles (+2 more)

### Community 146 - "carte/page.tsx"
Cohesion: 0.13
Nodes (21): main(), dynamic, GET(), GET(), CarteIndexPage(), dynamic, JoinMerchantPage(), getPublishedCardTemplate() (+13 more)

### Community 147 - "loyalty-service.test.ts"
Cohesion: 0.14
Nodes (13): activeProgram, baseMembership, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeLedgerCreate, loyaltyProgramFindUnique (+5 more)

### Community 148 - "exchange/route.ts"
Cohesion: 0.15
Nodes (15): ref_crypto, GET(), POST(), QaExchangeBody, qaJson(), qaNotFound(), dynamic, QaLoginPage() (+7 more)

### Community 149 - "src/app/layout.tsx"
Cohesion: 0.15
Nodes (8): src_app_globals, dynamic, manrope, metadata, viewport, PwaRegister(), THEME_COLOR, ThemeProvider()

### Community 150 - "customer-preferences-route.test.ts"
Cohesion: 0.22
Nodes (7): basePrefs, consentEventCreateMany, customerPreferencesCreate, customerPreferencesFindUnique, customerPreferencesUpdate, requireMutatingRequest, requireUser

### Community 151 - "wallet-home.tsx"
Cohesion: 0.08
Nodes (31): AddToGoogleWalletButton(), DiscoverIconLink(), NotificationBellLink(), WalletEventPayload, usePersonalizedQr(), useSponsoredAvailable(), WalletHome(), WalletQrAction() (+23 more)

### Community 152 - "sponsored-test-broadcast.test.ts"
Cohesion: 0.22
Nodes (8): adFindUnique, adRow, broadcastDelete, broadcastFindUnique, broadcastUpdate, broadcastUpsert, syncAll, walletCount

### Community 153 - "generate-pwa-icons.mjs"
Cohesion: 0.28
Nodes (8): ref_node_buffer, ref_node_zlib, chunk(), color, crc32(), outDir, png(), root

### Community 154 - "sponsored-slot.tsx"
Cohesion: 0.14
Nodes (20): src_components_fife_life_sponsored_banner_sponsoredad, SponsoredBanner(), src_components_fife_life_sponsored_banner_sponsoredvariant, isExternalUrl(), SponsoredAd, SponsoredOfferCard(), navigate(), onCardClick() (+12 more)

### Community 155 - "finalisation/page.tsx"
Cohesion: 0.27
Nodes (6): FinalisationPage(), FinalisationForm(), isSmsConfigured(), sendSms(), smsConfigHint(), SmsSendResult

### Community 157 - "employee-session.ts"
Cohesion: 0.18
Nodes (14): EmployeeLoginPage(), cookieOptions(), createEmployeeSession(), destroyEmployeeSession(), employeeCookieName(), employeeFromToken(), employeeFromTokenWithReason(), EmployeeSession (+6 more)

### Community 158 - "landing-hero-visual.tsx"
Cohesion: 0.33
Nodes (5): CoffeeIcon(), QrCodeIcon(), WalletCardsIcon(), WifiIcon(), LandingHeroVisual()

### Community 159 - "theme-toggle.tsx"
Cohesion: 0.40
Nodes (4): next-themes, MoonIcon(), SunIcon(), ThemeToggle()

### Community 160 - "ad-detail.tsx"
Cohesion: 0.10
Nodes (19): AdRequestDetail, AdStatus, AUDIT_LABELS, AuditRow, Delivery, Draft, Journey, PLACEMENT_LABELS (+11 more)

### Community 162 - "caisse-scan.test.ts"
Cohesion: 0.13
Nodes (14): caisseGrantCreate, customerMembershipCreate, customerMembershipFindFirst, customerMembershipUpdate, entitlementFindMany, entitlementUpdateMany, fifeLifeQrTokenFindUnique, fifeLifeQrTokenUpdate (+6 more)

### Community 163 - "visuels/[merchantId]/[filename]/route.ts"
Cohesion: 0.44
Nodes (8): GET(), fileUrlFromMediaPath(), isGoogleWalletHeroFilename(), isPublicGoogleWalletHeroMedia(), isPublicTestBroadcastWalletHeroMedia(), adVisualFilePath(), adVisualUrl(), fake

### Community 164 - "vitest"
Cohesion: 0.04
Nodes (34): vitest, customerMembershipFindMany, customerPreferencesFindMany, campaignQuotaUsageFindUnique, campaignQuotaUsageUpsert, executeRaw, fakeTx(), merchantSubscriptionFindUnique (+26 more)

### Community 165 - "landing-faq.tsx"
Cohesion: 0.40
Nodes (4): PlusIcon(), FAQ_ITEMS, FaqItem, LandingFaq()

### Community 166 - "avatar-storage.ts"
Cohesion: 0.50
Nodes (4): AVATAR_DIR, MIME_TO_EXT, parseAvatarDataUrl(), saveAvatar()

### Community 167 - "statistics/route.ts"
Cohesion: 0.15
Nodes (13): GET(), PERIOD_KEYS, requireMerchantStatsAccess(), InsightPeriodKey, getLockedInsightPlaceholder(), findUniqueSubscription, FREE_STATS, getFreeMerchantStats (+5 more)

### Community 168 - "staff-notification-delivery.ts"
Cohesion: 0.16
Nodes (18): web-push, isWebPushConfigured(), publicAppUrl(), ensureConfigured(), PushPayload, PushSendResult, sendPushToSubscription(), sendPushToUser() (+10 more)

### Community 170 - "landing-footer.tsx"
Cohesion: 0.67
Nodes (3): COLUMNS, isInternalPath(), LandingFooter()

### Community 171 - "google-wallet-doctor.ts"
Cohesion: 0.39
Nodes (8): google-auth-library, accessToken(), fail(), main(), ok(), pngSize(), googleWalletLogoUrl(), publicUrl()

### Community 172 - "sponsored-test-broadcast-global-wallet.integration.test.ts"
Cohesion: 0.50
Nodes (3): findFirst, findMany, globalObjects

### Community 173 - "resolveMediaFilePath"
Cohesion: 0.38
Nodes (5): GET(), MIME, GET(), MIME, resolveMediaFilePath()

### Community 174 - "SettingsPage"
Cohesion: 0.33
Nodes (3): SettingsPage(), patchProfile(), saveFieldEdit()

## Knowledge Gaps
- **1040 isolated node(s):** `examples`, `cards`, `deploy.sh script`, `eslintConfig`, `nextConfig` (+1035 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1392 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `demo-visual.ts`, `scan/ui.tsx`, `loyalty-context.ts`, `app/ui.tsx`, `env.ts`, `react`, `merchant-card-template-service.ts`, `cn`, `landing-header.tsx`, `scan/route.ts`, `super-admin-campaign-moderation.test.ts`, `validation.ts`, `fife-life/merchant-detail.tsx`, `rateLimit`, `marketing-topup-route.test.ts`, `carte/page.tsx`, `[id]/merchant-detail.tsx`, `clients/ui.tsx`, `requireUser`, `src/app/layout.tsx`, `jsonError`, `google-auth.ts`, `exchange/route.ts`, `jsonOk`, `finalisation/page.tsx`, `wallet-home.tsx`, `employee-session.ts`, `customer-profile.ts`, `hosts.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `visuels/[merchantId]/[filename]/route.ts`, `vitest`, `demo-routing.test.ts`, `customer-onboarding.ts`, `statistics/route.ts`, `ad-visual-ui-contracts.test.ts`, `landing-footer.tsx`, `loyalty-service.ts`, `resolveMediaFilePath`, `src/app/page.tsx`, `carte/avantages/page.tsx`, `super-admin/layout.tsx`, `demo-session.ts`, `qa-login.ts`, `sponsored-selection.ts`, `demo-mode.ts`, `employe/layout.tsx`, `card-enlarged-view.tsx`, `ref_fs`, `merchant-card-renderer.tsx`, `unsubscribe-token.ts`, `cards-index.tsx`, `profile-page.tsx`, `super-admin-session.ts`, `notifications-center.tsx`, `campaign-moderation-home.tsx`, `campagnes/ui.tsx`, `qr-cache.ts`, `profile-shared.tsx`, `customer-preferences-route.test.ts`, `campaign-crud-routes.test.ts`, `ad-confirm-route.test.ts`, `prisma.ts`, `campaign-confirm-route.test.ts`, `getSessionUser`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `scan/route.ts`, `loyalty-context.ts`, `next`, `merchant-card-template-service.ts`, `env.ts`, `react`, `loyalty-program.ts`, `stripe.ts`, `google-wallet-appearance.ts`, `loyalty-widget-view.tsx`, `loyalty-widget.ts`, `validation.ts`, `card-template-schema.ts`, `fife-life/merchant-detail.tsx`, `rateLimit`, `super-admin.test.ts`, `google-auth.ts`, `hosts.ts`, `preview-data.ts`, `package.json`, `google-wallet-media-crop.tsx`, `statistiques-panel.tsx`, `customer-onboarding.ts`, `stripe-webhook-marketing.test.ts`, `media-storage.ts`, `loyalty-commit.test.ts`, `insight-period.ts`, `loyalty-service.ts`, `card-editor-polish.test.ts`, `@prisma/client`, `ref_node_path`, `getActiveStripeMode`, `email.ts`, `insight-stats.ts`, `sponsored-slot.test.tsx`, `diagnose-google-wallet-campaign-hero.ts`, `sponsored-selection.ts`, `platform-stats.ts`, `card-enlarged-view.tsx`, `ref_fs`, `stripe-webhook-route.test.ts`, `fake-ad-db.ts`, `campaign-en-cours.ts`, `merchant-card-renderer.tsx`, `unsubscribe-token.ts`, `loyalty-commit.ts`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `ad-visual-journeys.test.ts`, `caisse-client-number.test.ts`, `[kind]/route.ts`, `lib/campaign-worker.ts`, `sponsored-test-broadcast.ts`, `apply-ad-visual-crop.ts`, `campaign-worker.test.ts`, `campaign-crud-routes.test.ts`, `use-wallet-unlock-animation.ts`, `ad-confirm-route.test.ts`, `campaign-confirm-route.test.ts`, `qr.ts`, `getSessionUser`, `scan/ui.tsx`, `employee-invitation-service.ts`, `super-admin-campaign-moderation.test.ts`, `landing-page.test.ts`, `webhook/route.ts`, `push-client.ts`, `card-deck.tsx`, `campaign-fixes.test.ts`, `admin-ad-fiche.test.ts`, `marketing-topup-route.test.ts`, `carte/page.tsx`, `loyalty-service.test.ts`, `exchange/route.ts`, `src/app/layout.tsx`, `customer-preferences-route.test.ts`, `wallet-home.tsx`, `sponsored-test-broadcast.test.ts`, `demo-routing.test.ts`, `caisse-scan.test.ts`, `visuels/[merchantId]/[filename]/route.ts`, `statistics/route.ts`, `staff-notification-delivery.ts`, `ad-visual-ui-contracts.test.ts`, `sponsored-test-broadcast-global-wallet.integration.test.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Why does `@prisma/client` connect `@prisma/client` to `scan/ui.tsx`, `next`, `loyalty-context.ts`, `employee-invitation-service.ts`, `merchant-card-template-service.ts`, `loyalty-program.ts`, `cn`, `programme/ui.tsx`, `stripe.ts`, `webhook/route.ts`, `validation.ts`, `loyalty-widget.ts`, `card-template-schema.ts`, `ad-visual-workflow.ts`, `fife-life/merchant-detail.tsx`, `rateLimit`, `ad-google-wallet-visual-workflow.ts`, `carte/page.tsx`, `customer-qr.ts`, `google-wallet.ts`, `requireUser`, `super-admin.test.ts`, `wallet-home.tsx`, `google-auth.ts`, `loyalty-service.test.ts`, `jsonOk`, `preview-data.ts`, `ad-visual-parts.tsx`, `card-editor-properties.tsx`, `customer-profile.ts`, `employee-session.ts`, `ad-detail.tsx`, `card-editor.tsx`, `package.json`, `customer-onboarding.ts`, `staff-notification-delivery.ts`, `loyalty-service.ts`, `preferences/route.ts`, `qa-login.ts`, `insight-stats.ts`, `diagnose-google-wallet-campaign-hero.ts`, `sponsored-selection.ts`, `platform-stats.ts`, `merchant-card-renderer.tsx`, `cards-index.tsx`, `loyalty-commit.ts`, `ads/[id]/confirm/route.ts`, `super-admin-session.ts`, `lib/campaign-worker.ts`, `sponsored-test-broadcast.ts`, `requireSuperAdmin`, `use-wallet-unlock-animation.ts`, `prisma.ts`, `qr.ts`, `create-super-admin.ts`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **What connects `examples`, `cards`, `deploy.sh script` to the rest of the system?**
  _1040 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `loyalty-context.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12195121951219512 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.06661991584852735 - nodes in this community are weakly interconnected._
- **Should `merchant-card-template-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07062146892655367 - nodes in this community are weakly interconnected._